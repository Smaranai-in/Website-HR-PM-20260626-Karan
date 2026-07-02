import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Send, Image as ImageIcon, FileText, CirclePlus, Menu, Reply, MoreVertical, Edit2, Trash, Check, X as CloseIcon, X } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { supabase } from '../../../supabaseClient'
import ImageModal from '../../components/ImageModal'
import MessageStatus from '../../components/MessageStatus'
import ReplyPreview from '../../components/ReplyPreview'
import '../../css/Admin.css'

export default function AdminChatArea({ user, selectedUser, onlineUsers, onToggleSidebar, onCloseChat, onExit }) {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [replyingTo, setReplyingTo] = useState(null)
    const [editingMessageId, setEditingMessageId] = useState(null)
    const [editContent, setEditContent] = useState('')
    const [activeMenuId, setActiveMenuId] = useState(null)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [showPlusMenu, setShowPlusMenu] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [pendingFile, setPendingFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const sendingRef = useRef(false);
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)
    const fileInputRef = useRef(null)
    const imageInputRef = useRef(null)

    const isSelectedUserOnline = selectedUser && onlineUsers.has(selectedUser.id)

    // Fetch messages between selected client and ANY admin
    const fetchMessages = useCallback(async (showLoading = false) => {
        if (!user || !selectedUser) return
        if (showLoading) setLoading(true)

        // Get all admin IDs so we can fetch messages regardless of which admin they spoke with
        const { data: admins } = await supabase
            .from('w_users')
            .select('id')
            .eq('role', 'admin')

        const adminIds = (admins || []).map(a => a.id)

        // Fetch all messages where selectedUser is sender/receiver with any admin
        let query = supabase
            .from('w_messages')
            .select(`*, reply_to_message:w_messages!reply_to_id(*)`)
            .order('created_at', { ascending: true })

        if (adminIds.length > 0) {
            // Messages from client to any admin, OR from any admin to client
            query = query.or(
                `and(sender_id.eq.${selectedUser.id},receiver_id.in.(${adminIds.join(',')})),and(sender_id.in.(${adminIds.join(',')}),receiver_id.eq.${selectedUser.id})`
            )
        } else {
            // Fallback to logged-in admin only
            query = query.or(
                `and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`
            )
        }

        const { data, error } = await query
        if (!error) setMessages(data || [])
        setLoading(false)
    }, [user, selectedUser])

    useEffect(() => {
        fetchMessages(true)
    }, [fetchMessages])

    // Real-time subscription
    useEffect(() => {
        if (!user || !selectedUser) return

        const channel = supabase
            .channel(`admin-chat-${selectedUser.id}`)
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'w_messages' },

               (payload) => {
    console.log("ADMIN REALTIME:", payload);

    const msg = payload.new || payload.old;

    const isRelevant =
        String(msg.sender_id) === String(selectedUser.id) ||
        String(msg.receiver_id) === String(selectedUser.id);

    if (!isRelevant) return;

if (payload.eventType === 'INSERT') {
    fetchMessages();
} else if (payload.eventType === 'UPDATE') {
        setMessages(prev =>
            prev.map(m =>
                m.id === payload.new.id ? { ...m, ...payload.new } : m
            )
        );
    } else if (payload.eventType === 'DELETE') {
        setMessages(prev =>
            prev.map(m =>
                m.id === payload.old.id
                    ? {
                        ...m,
                        is_deleted: true,
                        content: 'This message was deleted'
                    }
                    : m
            )
        );
    }
}
            )
            .subscribe((status) => {
    console.log("ADMIN STATUS:", status);
})

        return () => supabase.removeChannel(channel)
    }, [user, selectedUser, fetchMessages])

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto'
            inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px'
        }
    }, [newMessage])

    // Close menus on outside click
    useEffect(() => {
        const handle = (e) => {
            if (!e.target.closest('.message-menu-btn') && !e.target.closest('.message-menu-dropdown')) setActiveMenuId(null)
            if (showPlusMenu && !e.target.closest('.plus-menu-container')) setShowPlusMenu(false)
        }
        document.addEventListener('click', handle)
        return () => document.removeEventListener('click', handle)
    }, [showPlusMenu])

    // Mark received messages as read
 useEffect(() => {
    if (!user || !selectedUser || messages.length === 0) return;

    const unread = messages
        .filter(
            m =>
                m.sender_id === selectedUser.id &&
                m.receiver_id === user.id &&
                m.status !== 'read'
        )
        .map(m => m.id);

    console.log("UNREAD IDS:", unread);

    if (unread.length > 0) {
        (async () => {
           const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) return;

const response = await fetch(
  `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      action: "mark_messages_read",
      ids: unread,
    }),
  }
);

const result = await response.json();

console.log(result);
        })();
    }
}, [messages, user, selectedUser]);

const sendMessage = async (e, replyToId = null) => {
    e?.preventDefault();

    if (!newMessage.trim()) return;

    // immediate lock
    if (sendingRef.current) return;

    sendingRef.current = true;
    setIsSending(true);

    try {
        const text = newMessage.trim();
        setNewMessage('');

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
                    receiver_id: selectedUser.id,
                    content: text,
                    reply_to_id: replyToId || null,
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }
    } finally {
        sendingRef.current = false;
        setIsSending(false);
    }
};

    const handleFileUpload = async (file) => {
        if (!file) return
        const isImage = file.type.startsWith('image/')
        const bucket = isImage ? 'chat-images' : 'chat-files'
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`

        const { data, error } = await supabase.storage.from(bucket).upload(path, file)
        if (error) { console.error('Upload error:', error); return }

        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
        const content = isImage ? `[IMAGE] ${publicUrl}` : `[FILE] ${publicUrl}|${file.name}`

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
      receiver_id: selectedUser.id,
      content,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error);
}
        setPendingFile(null)
        setPreviewUrl(null)
    }

const handleEditMessage = async (id, content) => {
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
      id,
      content,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error);
}

setEditingMessageId(null);
}

   const handleDeleteMessage = async (id) => {
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
      id,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error);
}
}

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (pendingFile) { await handleFileUpload(pendingFile); setReplyingTo(null) }
            if (newMessage.trim()) { await sendMessage(e, replyingTo?.id); setReplyingTo(null) }
            if (inputRef.current) inputRef.current.style.height = 'auto'
        }
    }

    const handlePaste = (e) => {
        const items = e.clipboardData?.items
        if (!items) return
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault()
                const file = items[i].getAsFile()
                if (file) { setPendingFile(file); setPreviewUrl(URL.createObjectURL(file)) }
                return
            }
        }
    }

    const isEmojiOnly = (content) => /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\s)+$/u.test(content)

    const scrollToMessage = (id) => {
        const el = document.getElementById(`msg-${id}`)
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('message-highlight'); setTimeout(() => el.classList.remove('message-highlight'), 1500) }
    }

    const renderQuotedMessage = (msg) => {
        if (!msg.reply_to_message || !msg.reply_to_message.id) return null
        const replyMsg = msg.reply_to_message
        let content = replyMsg.content || ''
        if (content.startsWith('[IMAGE]')) content = '📷 Photo'
        else if (content.startsWith('[FILE]')) content = '📄 ' + (content.split('|')[1] || 'Document')
        return (
            <div className="quoted-message" onClick={(e) => { e.stopPropagation(); scrollToMessage(replyMsg.id) }}>
                <div className="quoted-sender">{replyMsg.sender_id === user.id ? 'You' : selectedUser.name || 'User'}</div>
                <div className="quoted-content">{content}</div>
            </div>
        )
    }

    const renderMenu = (msg) => {
        if (msg.is_deleted) return null
        const isOwner = msg.sender_id === user.id
        const isRecent = (new Date() - new Date(msg.created_at)) < 5 * 60 * 1000
        return (
            <div className={`absolute top-0 ${isOwner ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                <div className="relative">
                    <button className="message-menu-btn p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"
                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === msg.id ? null : msg.id) }}>
                        <MoreVertical className="w-4 h-4" />
                    </button>
                    {activeMenuId === msg.id && (
                        <div className="message-menu-dropdown absolute bottom-full mb-1 right-0 w-32 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                                onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); setActiveMenuId(null); inputRef.current?.focus() }}>
                                <Reply className="w-3 h-3" /> Reply
                            </button>
                            {isOwner && isRecent && !msg.content.startsWith('[IMAGE]') && !msg.content.startsWith('[FILE]') && (
                                <button className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                                    onClick={(e) => { e.stopPropagation(); setEditingMessageId(msg.id); setEditContent(msg.content); setActiveMenuId(null) }}>
                                    <Edit2 className="w-3 h-3" /> Edit
                                </button>
                            )}
                            {isOwner && isRecent && (
                                <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); setActiveMenuId(null) }}>
                                    <Trash className="w-3 h-3" /> Delete
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const renderMessageBubble = (msg) => {
        const isImage = msg.content.startsWith('[IMAGE] ')
        const isFile = msg.content.startsWith('[FILE] ')
        const isEmoji = !isImage && !isFile && isEmojiOnly(msg.content)
        const isOwn = msg.sender_id === user.id
        const isEditing = editingMessageId === msg.id
        const timeString = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        if (msg.is_deleted) return (
            <div className={`admin-message-bubble ${isOwn ? 'sent' : 'received'} italic text-slate-400`}>
                <div className="admin-bubble-content flex items-center gap-2"><Trash className="w-3 h-3" /><span>{msg.content}</span></div>
            </div>
        )

        if (isEditing) return (
            <div className={`admin-message-bubble ${isOwn ? 'sent' : 'received'}`}>
                <div className="flex flex-col gap-2 min-w-[200px]">
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (editContent.trim()) handleEditMessage(msg.id, editContent) } else if (e.key === 'Escape') setEditingMessageId(null) }}
                        className="bg-black/20 text-white p-2 rounded text-sm w-full outline-none focus:ring-1 focus:ring-blue-500 resize-none" rows={2} autoFocus />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingMessageId(null)} className="p-1 hover:bg-white/10 rounded"><CloseIcon className="w-4 h-4 text-red-400" /></button>
                        <button onClick={() => { if (editContent.trim()) handleEditMessage(msg.id, editContent) }} className="p-1 hover:bg-white/10 rounded"><Check className="w-4 h-4 text-green-400" /></button>
                    </div>
                </div>
            </div>
        )

        if (isFile) {
            const [url, fileName] = msg.content.replace('[FILE] ', '').split('|')
            return (
                <div className={`admin-message-bubble group relative ${isOwn ? 'sent' : 'received'}`}>
                    {renderQuotedMessage(msg)}
                    <div className="admin-bubble-content !flex-col !bg-transparent !p-0">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-black/20 p-3 rounded-lg hover:bg-black/30 transition-colors border border-white/10 min-w-[200px]">
                            <div className="bg-blue-500/20 p-2 rounded-full"><FileText className="w-6 h-6 text-blue-400" /></div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-medium truncate text-white">{fileName || 'Document'}</span>
                                <span className="text-xs text-blue-400">Click to open</span>
                            </div>
                        </a>
                        <span className="admin-message-time inline-flex items-center gap-0.5 ml-auto align-bottom relative top-1">
                            {msg.is_edited && <span className="text-[10px] text-gray-400 mr-1">(edited)</span>}
                            {timeString}<MessageStatus status={msg.status} isOwnMessage={isOwn} />
                        </span>
                    </div>
                    {renderMenu(msg)}
                </div>
            )
        }

        if (isImage) {
            const imageUrl = msg.content.replace('[IMAGE] ', '')
            return (
                <div className={`admin-message-bubble group relative ${isOwn ? 'sent' : 'received'} !p-1 !max-w-[80%]`}>
                    {renderQuotedMessage(msg)}
                    <div onClick={() => setSelectedImage(imageUrl)} className="cursor-pointer">
                        <img src={imageUrl} alt="Shared" className="admin-chat-image" loading="lazy" />
                    </div>
                    <div className="absolute bottom-1 right-2 flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                        {msg.is_edited && <span className="text-[10px] text-white/80">(edited)</span>}
                        <span className="text-[10px] text-white/90">{timeString}</span>
                        <div className="text-white/90 scale-75 origin-right"><MessageStatus status={msg.status} isOwnMessage={isOwn} /></div>
                    </div>
                    {renderMenu(msg)}
                </div>
            )
        }

        if (isEmoji) return (
            <div className="relative group bg-transparent p-0 shadow-none border-none">
                {renderMenu(msg)}
                {renderQuotedMessage(msg)}
                <p className="text-5xl leading-tight">{msg.content}</p>
                <span className="text-gray-400 text-xs flex items-center justify-end gap-1 mt-1">
                    {msg.is_edited && <span className="text-[10px] text-gray-500 mr-1">(edited)</span>}
                    {timeString}<MessageStatus status={msg.status} isOwnMessage={isOwn} />
                </span>
            </div>
        )

        return (
            <div className={`admin-message-bubble group relative ${isOwn ? 'sent' : 'received'}`}>
                {renderQuotedMessage(msg)}
                <div className="admin-bubble-content">
                    <span>{msg.content}</span>
                    <span className="admin-message-time flex items-center gap-1">
                        {msg.is_edited && <span className="text-[10px] text-gray-400">(edited)</span>}
                        {timeString}<MessageStatus status={msg.status} isOwnMessage={isOwn} />
                    </span>
                </div>
                {renderMenu(msg)}
            </div>
        )
    }

    const renderMessages = () => {
        const result = []
        let lastDate = null
        messages.forEach((msg, index) => {
            const dateStr = new Date(msg.created_at).toLocaleDateString()
            if (dateStr !== lastDate) {
                const today = new Date().toLocaleDateString()
                const yesterday = new Date(Date.now() - 86400000).toLocaleDateString()
                const label = dateStr === today ? 'Today' : dateStr === yesterday ? 'Yesterday' : dateStr
                result.push(<div key={`date-${index}`} className="date-separator"><span className="date-pill">{label}</span></div>)
                lastDate = dateStr
            }
            const isOwn = msg.sender_id === user.id
            result.push(
                <div key={msg.id} id={`msg-${msg.id}`}
                    className={`admin-message-wrapper ${isOwn ? 'sent' : 'received'}`}
                    onMouseEnter={() => { }} onMouseLeave={() => { }}>
                    {renderMessageBubble(msg)}
                </div>
            )
        })
        return result
    }

    return (
        <div className="admin-chat-container flex flex-col h-full">
            <ImageModal isOpen={!!selectedImage} imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />

            {/* ── HEADER ── */}
            <div className="admin-chat-header">
                {/* Left side: back btn + burger + avatar + info */}
                <div className="flex items-center gap-2 min-w-0">
                    {/* ← Back to conversations list */}
                    <button
                        onClick={onCloseChat}
                        className="admin-back-btn"
                        title="Back to conversations"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Mobile sidebar toggle */}
                    <button className="admin-mobile-menu-btn" onClick={onToggleSidebar}>
                        <Menu className="h-5 w-5" />
                    </button>

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        {selectedUser.profile_url ? (
                            <img
                                src={selectedUser.profile_url}
                                alt=""
                                className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                                {(selectedUser.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        {isSelectedUserOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
                        )}
                    </div>

                    {/* Name + status */}
                    <div className="flex flex-col min-w-0">
                        <span className="admin-chat-name truncate">{selectedUser.name || 'Unknown User'}</span>
                        <span className={`text-xs font-medium ${isSelectedUserOnline ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {isSelectedUserOnline ? '● Online now' : '○ Offline'}
                        </span>
                    </div>
                </div>

                {/* Right side: Exit button */}
                <button
                    onClick={onExit}
                    className="admin-exit-btn"
                    title="Exit to homepage"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Exit
                </button>
            </div>

            {/* Messages */}
            <div className="admin-messages-list flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                        <svg className="animate-spin w-6 h-6 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        <span className="text-sm">Loading messages...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                        <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center text-3xl">💬</div>
                        <p className="text-sm">No messages yet.</p>
                        <p className="text-xs text-slate-500">Send a message to start the conversation.</p>
                    </div>
                ) : (
                    <>
                        {renderMessages()}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Form */}
            <form onSubmit={async (e) => {
                e.preventDefault()
                if (pendingFile) { await handleFileUpload(pendingFile); setReplyingTo(null) }
            if (newMessage.trim()) {
    await sendMessage(e, replyingTo?.id);
    setReplyingTo(null);
}
                setTimeout(() => inputRef.current?.focus(), 10)
            }} className="admin-input-form relative !flex-col !items-stretch !gap-0 !pb-2">

                {previewUrl && (
                    <div className="absolute bottom-full left-4 mb-2 p-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                        <div className="relative">
                            <img src={previewUrl} alt="Preview" className="h-32 w-auto rounded-md object-cover border border-slate-600" />
                            <button type="button" onClick={() => { setPendingFile(null); setPreviewUrl(null) }}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                <ReplyPreview replyingTo={replyingTo} onCancel={() => setReplyingTo(null)} />

                <div className="flex items-end gap-2 w-full pt-2 border-t border-transparent">
                    <input type="file" ref={imageInputRef} className="hidden" accept="image/*"
                        onChange={(e) => { const f = e.target.files[0]; if (f) { handleFileUpload(f); setShowPlusMenu(false) } }} />
                    <input type="file" ref={fileInputRef} className="hidden"
                        onChange={(e) => { const f = e.target.files[0]; if (f) { handleFileUpload(f); setShowPlusMenu(false) } }} />

                    <div className="relative plus-menu-container">
                        <button type="button" onClick={(e) => { e.stopPropagation(); setShowPlusMenu(!showPlusMenu) }}
                            className="admin-upload-btn text-gray-400 hover:text-white">
                            <CirclePlus className={`h-6 w-6 transition-transform ${showPlusMenu ? 'rotate-45' : ''}`} />
                        </button>
                        {showPlusMenu && (
                            <div className="absolute bottom-12 left-0 bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl p-2 w-48 z-50 flex flex-col gap-1">
                                <button type="button" onClick={() => imageInputRef.current?.click()}
                                    className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg text-left transition-colors">
                                    <div className="bg-purple-500/20 p-2 rounded-full"><ImageIcon className="w-4 h-4 text-purple-400" /></div>
                                    <span className="text-sm text-slate-200 font-medium">Photos & Videos</span>
                                </button>
                                <button type="button" onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg text-left transition-colors">
                                    <div className="bg-blue-500/20 p-2 rounded-full"><FileText className="w-4 h-4 text-blue-400" /></div>
                                    <span className="text-sm text-slate-200 font-medium">Document</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <textarea ref={inputRef} value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown} onPaste={handlePaste}
                        placeholder={`Reply to ${selectedUser.name || 'user'}...`}
                        className="admin-input-field" rows={1} />

                    <button type="submit" disabled={(!newMessage.trim() && !pendingFile) || isSending}
                        className={`admin-send-btn ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </form>
        </div>
    )
}
