import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../components/AuthProvider'
import { supabase } from '../../../supabaseClient'
import ChatArea from './ChatArea'
import '../../css/Client.css'

export default function ClientDashboard() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [adminId, setAdminId] = useState(null)
  const messagesEndRef = useRef(null)

  const callEdge = async (action, payload) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Please login again');
    }

    const response = await fetch(
      `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action, ...payload }),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result?.error) {
      throw new Error(result?.error || 'Edge request failed');
    }

    return result;
  };

  // Fetch Admin ID
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const result = await callEdge("get_client_chat_admins_and_messages");
        const adminData = result.adminUser;
        if (adminData?.id) {
          setAdminId(adminData.id);
        }
      } catch (err) {
        console.error("Error fetching admin from edge function:", err);
      }
    }
    fetchAdmin()
  }, [user])

  // Fetch Messages & Subscribe
  useEffect(() => {
    if (!user) return

    const fetchMessages = async () => {
      try {
        const result = await callEdge("get_client_chat_admins_and_messages");
        const data = result.messages;
        if (data) {
          setMessages(data)
          const unreadIds = data
            .filter(m => m.receiver_id === user.id && m.status !== 'read')
            .map(m => m.id)
          if (unreadIds.length > 0) {
            await callEdge('mark_messages_read', { ids: unreadIds })
          }
        }
      } catch (err) {
        console.error('Fetch messages error:', err)
      }
    }

    fetchMessages()

    const channel = supabase
      .channel(`client-chat-${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'w_messages' },
        (payload) => {
          if (payload.new.receiver_id === user.id || payload.new.sender_id === user.id) {
            setMessages((prev) => {
              if (prev.some(m => m.id === payload.new.id)) return prev
              // Replace temp message if exists
              const tempIdx = prev.findIndex(m =>
                String(m.id).startsWith('temp-') &&
                m.content === payload.new.content &&
                m.sender_id === payload.new.sender_id
              )
              if (tempIdx !== -1) {
                const updated = [...prev]
                updated[tempIdx] = payload.new
                return updated
              }
              return [...prev, payload.new]
            })
            if (payload.new.receiver_id === user.id) {
              callEdge('mark_messages_read', { ids: [payload.new.id] }).catch(console.error)
            }
          }
        }
      )
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'w_messages' },
        (payload) => {
          if (payload.new.receiver_id === user.id || payload.new.sender_id === user.id) {
            setMessages((prev) => prev.map(msg =>
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
            ))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const insertMessage = async (content, replyToId = null) => {
    if (!adminId) {
      alert('Cannot send: admin not found. Please refresh the page.')
      return
    }

    // Optimistic update - show immediately
    const tempId = `temp-${Date.now()}`
    const tempMsg = {
      id: tempId,
      sender_id: user.id,
      receiver_id: adminId,
      content,
      reply_to_id: replyToId,
      created_at: new Date().toISOString(),
      status: 'sending',
      reply_to_message: replyToId ? messages.find(m => m.id === replyToId) || null : null,
    }
    setMessages(prev => [...prev, tempMsg])

    // Insert into DB
    console.log('[Chat Debug] Inserting message:', { sender_id: user.id, receiver_id: adminId, content })
   try {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Please login again");
  }

  const response = await fetch(
    `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        action: "send_chat_message",
        receiver_id: adminId,
        content,
        reply_to_id: replyToId,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  const sentData = result.message;

  console.log('[Chat Debug] Insert result:', sentData);

  setMessages(prev =>
    prev.map(m => m.id === tempId ? sentData : m)
  );

} catch (error) {
  console.error(error);

  setMessages(prev =>
    prev.filter(m => m.id !== tempId)
  );

  alert(error.message);
}
  }

  const handleSendMessage = async (e, replyToId) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    await insertMessage(newMessage, replyToId)
    setNewMessage('')
  }

  const handleReaction = async (messageId, emoji) => {
    try{
    const msg = messages.find(m => m.id === messageId)
    if (!msg) return
    const currentReactions = msg.reactions || {}
    const userIds = currentReactions[emoji] || []
    let newReactions = { ...currentReactions }
    if (userIds.includes(user.id)) {
      newReactions[emoji] = userIds.filter(id => id !== user.id)
      if (newReactions[emoji].length === 0) delete newReactions[emoji]
    } else {
      newReactions[emoji] = [...userIds, user.id]
    }
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reactions: newReactions } : m))
    const {
  data: { session },
} = await supabase.auth.getSession();
if (!session) {
  throw new Error("Please login again");
}
await fetch(
  `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      action: "update_message_reactions",
      id: messageId,
      reactions: newReactions,
    }),
  }
);
  }catch (error) {
    console.error(error);
    alert(error.message);
  }
  }

  const handleFileUpload = async (file) => {
    if (!file) return
    const isImage = file.type.startsWith('image/')
    const bucket = isImage ? 'chat-images' : 'chat-files'
    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)
    if (uploadError) { alert('Upload error: ' + uploadError.message); return }
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath)
    if (isImage) await insertMessage(`[IMAGE] ${publicUrl}`)
    else await insertMessage(`[FILE] ${publicUrl}|${file.name}`)
  }

const handleEditMessage = async (messageId, newContent) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Please login again");
    }

   const response = await fetch(
  `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      action: "edit_chat_message",
      id: messageId,
      content: newContent,
    }),
  }
);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    setMessages(prev =>
      prev.map(m =>
        m.id === messageId
          ? { ...m, content: newContent, is_edited: true }
          : m
      )
    );
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

const handleDeleteMessage = async (messageId) => {
  try{
 const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  throw new Error("Please login again");
}

const response = await fetch(
  `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      action: "delete_chat_message",
      id: messageId,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error);
}

 

  setMessages(prev =>
    prev.map(m =>
      m.id === messageId
        ? {
            ...m,
            content: 'This message was deleted',
            is_deleted: true
          }
        : m
    )
  );
}catch (error) {
  console.error(error);
  alert(error.message);
}
};

  return (
    <div className="client-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ChatArea
        user={user}
        adminId={adminId}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        onReaction={handleReaction}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        messagesEndRef={messagesEndRef}
      />
    </div>
  )
}
