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

  // Fetch Admin ID
  useEffect(() => {
    const fetchAdmin = async () => {
      console.log('[Chat Debug] Fetching admin from w_users...')
      const { data, error } = await supabase
        .from('w_users')
        .select('id, email, role')
        .eq('role', 'admin')
        .limit(1)
        .maybeSingle()

      console.log('[Chat Debug] Admin fetch result:', { data, error })

      if (data?.id) {
        console.log('[Chat Debug] Admin ID set to:', data.id, '| email:', data.email)
        setAdminId(data.id)
      } else {
        console.error('[Chat Debug] Admin NOT found in w_users. Error:', error)
        if (error?.code === 'PGRST116') {
          console.warn('[Chat Debug] RLS policy may be blocking w_users read. Run chat_setup.sql in Supabase.')
        }
      }
    }
    fetchAdmin()
  }, [])

  // Fetch Messages & Subscribe
  useEffect(() => {
    if (!user) return

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('w_messages')
        .select(`
          *,
          reply_to_message:reply_to_id (
            id, content, sender_id, created_at
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setMessages(data)
        const unreadIds = data
          .filter(m => m.receiver_id === user.id && m.status !== 'read')
          .map(m => m.id)
        if (unreadIds.length > 0) {
          await supabase.from('w_messages').update({ status: 'read' }).in('id', unreadIds)
        }
      } else {
        console.error('Fetch messages error:', error)
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
              supabase.from('w_messages').update({ status: 'read' }).eq('id', payload.new.id).then()
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
    const { data: sentData, error } = await supabase
      .from('w_messages')
      .insert({ sender_id: user.id, receiver_id: adminId, content, reply_to_id: replyToId })
      .select(`*, reply_to_message:reply_to_id (id, content, sender_id, created_at)`)
      .single()

    console.log('[Chat Debug] Insert result:', { sentData, error })

    if (sentData) {
      setMessages(prev => prev.map(m => m.id === tempId ? sentData : m))
    } else if (error) {
      console.error('[Chat Debug] Send error full details:', JSON.stringify(error))
      setMessages(prev => prev.filter(m => m.id !== tempId))
      alert('Failed to send: ' + error.message + '\n\nCode: ' + error.code + '\n\nCheck browser console for details.')
    }
  }

  const handleSendMessage = async (e, replyToId) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    await insertMessage(newMessage, replyToId)
    setNewMessage('')
  }

  const handleReaction = async (messageId, emoji) => {
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
    await supabase.from('w_messages').update({ reactions: newReactions }).eq('id', messageId)
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
    const { error } = await supabase.from('w_messages')
      .update({ content: newContent, is_edited: true }).eq('id', messageId)
    if (error) { alert('Edit failed'); return }
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: newContent, is_edited: true } : m))
  }

  const handleDeleteMessage = async (messageId) => {
    const { error } = await supabase.from('w_messages')
      .update({ content: 'This message was deleted', is_deleted: true }).eq('id', messageId)
    if (error) { alert('Delete failed'); return }
    setMessages(prev => prev.map(m => m.id === messageId
      ? { ...m, content: 'This message was deleted', is_deleted: true } : m))
  }

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
