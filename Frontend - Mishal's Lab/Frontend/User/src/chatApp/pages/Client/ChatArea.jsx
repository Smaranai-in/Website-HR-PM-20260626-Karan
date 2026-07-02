import React, { useRef, useState, useEffect } from 'react'
import { Send, Image as ImageIcon, Smile, SmilePlus, Menu, Star, Maximize, Minimize, Reply, X, Plus, FileText, CirclePlus, MoreVertical, Edit2, Trash, Check, X as CloseIcon } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import ChatImage from '../../components/ChatImage'
import ImageModal from '../../components/ImageModal'
import MessageStatus from '../../components/MessageStatus'
import ReplyPreview from '../../components/ReplyPreview'
import '../../css/Client.css'

import { useAuth } from '../../components/AuthProvider'

export default function ChatArea({ 
  user,
  adminId, 
  messages, 
  newMessage, 
  setNewMessage, 
  onSendMessage, 
  onFileUpload,
  onReaction,
  onRequestClearChat, 
  messagesEndRef,
  onOpenMobileMenu,
  onEditMessage,
  onDeleteMessage
}) {
  const { onlineUsers } = useAuth() 
  const isAdminOnline = adminId && onlineUsers.has(adminId)

  // ... (refs and state are fine)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const inputRef = useRef(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showPlusMenu, setShowPlusMenu] = useState(false)
  const [hoveredMessageId, setHoveredMessageId] = useState(null)
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [replyingTo, setReplyingTo] = useState(null)

  const [selectedImage, setSelectedImage] = useState(null)
  
  const [pendingFile, setPendingFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isSending, setIsSending] = useState(false)

  // Swipe State
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [swipedMessageId, setSwipedMessageId] = useState(null)

  // ... (useEffects)

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px'
    }
  }, [newMessage])

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
        if (!e.target.closest('.message-menu-btn') && !e.target.closest('.message-menu-dropdown')) {
            setActiveMenuId(null)
        }

        // Close plus menu if clicked outside
        if (showPlusMenu && !e.target.closest('.plus-menu-container')) {
            setShowPlusMenu(false)
        }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showPlusMenu])

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      
      if (isSending) return

      if (newMessage.trim() || pendingFile) {
        setIsSending(true)
        try {
        if (pendingFile) {
            await onFileUpload(pendingFile) // File upload handles replies externally if needed, or we modify generic upload
            setPendingFile(null)
            setPreviewUrl(null)
            setReplyingTo(null)
        }
        
        // Handle text message if exists
        if (newMessage.trim()) {
             // Pass replyingTo ID if implementation allows modifying onSendMessage signature or we wrap it
            await onSendMessage(e, replyingTo?.id)
            setReplyingTo(null)
        }
        
        // Reset height
        if (inputRef.current) {
            inputRef.current.style.height = 'auto'
        }
        // Force focus back
        setTimeout(() => inputRef.current?.focus(), 10)
      } finally {
        setIsSending(false)
      }
    }
  }
  }
  
  // Swipe Helpers
  const onTouchStart = (e) => {
      setTouchEnd(null) 
      setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEnd = (msg) => {
      if (!touchStart || !touchEnd) return
      const distance = touchStart - touchEnd
      const isLeftSwipe = distance > 50
      const isRightSwipe = distance < -50

      if (isRightSwipe) {
          // Trigger Reply
          setReplyingTo(msg)
          inputRef.current?.focus()
      }
  }

  const handleEditKeyDown = (e, messageId) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          if (editContent.trim()) {
              onEditMessage(messageId, editContent)
              setEditingMessageId(null)
          }
      } else if (e.key === 'Escape') {
          setEditingMessageId(null)
      }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileUpload(file)
      setShowPlusMenu(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileUpload(file) // Reused generic handler
      setShowPlusMenu(false)
    }
  }

  const isEmojiOnly = (content) => {
      const emojiRegex = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\s)+$/u
      return emojiRegex.test(content)
  }

  const scrollToMessage = (id) => {
      const element = document.getElementById(`msg-${id}`)
      if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.classList.add('message-highlight')
          setTimeout(() => element.classList.remove('message-highlight'), 1500)
      }
  }

  const renderQuotedMessage = (msg) => {
      if (!msg.reply_to_message) return null
      
      const replyMsg = msg.reply_to_message
      const isImage = replyMsg.content.startsWith('[IMAGE] ')
      const isFile = replyMsg.content.startsWith('[FILE] ')
      
      let content = replyMsg.content
      if (isImage) content = "Photo"
      else if (isFile) {
         const parts = replyMsg.content.replace('[FILE] ', '').split('|')
         content = parts[1] || "Document"
      }

      return (
          <div 
            className="quoted-message"
            onClick={(e) => {
                e.stopPropagation()
                scrollToMessage(replyMsg.id)
            }}
          >
              <div className="quoted-sender">{replyMsg.sender_name || 'User'}</div>
              <div className="quoted-content">
                  {isImage && <ImageIcon className="w-3 h-3" />}
                  {isFile && <FileText className="w-3 h-3" />}
                  {content}
              </div>
          </div>
      )
  }

  // Helper to render formatting
  const renderMessageBubble = (msg) => {
    const isImage = msg.content.startsWith('[IMAGE] ')
    const isFile = msg.content.startsWith('[FILE] ')
    const isEmoji = !isImage && !isFile && isEmojiOnly(msg.content)
    const isDeleted = msg.is_deleted
    const isOwnMessage = msg.sender_id === user.id
    const isEditing = editingMessageId === msg.id
    
    // Time formatting
    const timeString = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    if (isDeleted) {
        return (
            <div className={`client-message-bubble ${isOwnMessage ? 'sent' : 'received'} italic text-slate-400`}>
                <div className="client-bubble-content flex items-center gap-2">
                    <Trash className="w-3 h-3" />
                    <span>{msg.content}</span>
                </div>
            </div>
        )
    }

    if (isEditing) {
        return (
            <div className={`client-message-bubble ${isOwnMessage ? 'sent' : 'received'} !w-full max-w-md`}>
                <div className="flex flex-col gap-2 min-w-[200px]">
                    <textarea 
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, msg.id)}
                        className="bg-black/20 text-white p-2 rounded text-sm w-full outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        rows={2}
                        autoFocus
                    />
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => setEditingMessageId(null)}
                            className="p-1 hover:bg-white/10 rounded"
                        >
                            <CloseIcon className="w-4 h-4 text-red-400" />
                        </button>
                        <button 
                            onClick={() => {
                                if (editContent.trim()) {
                                    onEditMessage(msg.id, editContent)
                                    setEditingMessageId(null)
                                }
                            }}
                            className="p-1 hover:bg-white/10 rounded"
                        >
                            <Check className="w-4 h-4 text-green-400" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // [FILE] Rendering
    if (isFile) {
         const fileContent = msg.content.replace('[FILE] ', '')
         const [url, fileName] = fileContent.split('|')
         const displayFileName = fileName || 'Document'
         
         return (
            <div className={`client-message-bubble group relative ${isOwnMessage ? 'sent' : 'received'}`}>
                 {renderQuotedMessage(msg)}
                 <div className="client-bubble-content !flex-col !bg-transparent !p-0">
                     <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-black/20 p-3 rounded-lg hover:bg-black/30 transition-colors border border-white/10 min-w-[200px]">
                         <div className="bg-blue-500/20 p-2 rounded-full">
                            <FileText className="w-6 h-6 text-blue-400" />
                         </div>
                         <div className="flex flex-col overflow-hidden">
                             <span className="text-sm font-medium truncate client-text-adaptive">{displayFileName}</span>
                             <span className="text-xs text-blue-400">Click to open</span>
                         </div>
                     </a>
                     <span className="client-message-time inline-flex items-center gap-0.5 ml-auto align-bottom relative top-1">
                        {msg.is_edited && <span className="text-[10px] text-gray-400 mr-1">(edited)</span>}
                        {timeString}
                        <MessageStatus status={msg.status} isOwnMessage={isOwnMessage} />
                    </span>
                 </div>
                 {renderMenu(msg, isOwnMessage)}
            </div>
         )
    }

    if (isImage) {
        const imageUrl = msg.content.replace('[IMAGE] ', '')
        return (
            <div className={`client-message-bubble group relative ${isOwnMessage ? 'sent' : 'received'} !p-1 !max-w-[80%]`}>
                 {renderQuotedMessage(msg)}
                <div onClick={() => setSelectedImage(imageUrl)} className="cursor-pointer">
                    <img 
                        src={imageUrl} 
                        alt="Shared" 
                        className="client-chat-image" 
                        loading="lazy"
                    />
                </div>
                <div className="absolute bottom-1 right-2 flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                    {msg.is_edited && <span className="text-[10px] text-white/80">(edited)</span>}
                    <span className="text-[10px] text-white/90">{timeString}</span>
                    <div className="text-white/90 scale-75 origin-right">
                        <MessageStatus status={msg.status} isOwnMessage={isOwnMessage} />
                    </div>
                </div>
                {renderMenu(msg, isOwnMessage)}
            </div>
        )
    }

    if (isEmoji) {
        return (
            <div className="relative group bg-transparent p-0 shadow-none border-none">
                {renderMenu(msg, isOwnMessage)}
                {renderQuotedMessage(msg)}
                <p className="text-5xl leading-tight">{msg.content}</p>
                <span className="text-gray-400 text-xs shadow-black drop-shadow-md flex items-center justify-end gap-1 mt-1">
                    {msg.is_edited && <span className="text-[10px] text-gray-500 mr-1">(edited)</span>}
                    {timeString}
                    <MessageStatus status={msg.status} isOwnMessage={isOwnMessage} />
                </span>
            </div>
        )
    }

    // Standard Text
    return (
        <div className={`client-message-bubble group relative ${isOwnMessage ? 'sent' : 'received'}`}>
            {renderQuotedMessage(msg)}
            <div className="client-bubble-content">
                <span>{msg.content}</span>
                <span className="client-message-time flex items-center gap-1">
                     {msg.is_edited && <span className="text-[10px] text-gray-400">(edited)</span>}
                    {timeString}
                    <MessageStatus status={msg.status} isOwnMessage={isOwnMessage} />
                </span>
            </div>
            {renderMenu(msg, isOwnMessage)}
        </div>
    )
  }

  const renderMessagesWithDates = () => {
    const result = []
    let lastDate = null

    messages.forEach((msg, index) => {
        const msgDate = new Date(msg.created_at)
        const dateString = msgDate.toLocaleDateString()
        
        if (dateString !== lastDate) {
            const today = new Date()
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            
            let label = dateString
            if (dateString === today.toLocaleDateString()) {
                label = 'Today'
            } else if (dateString === yesterday.toLocaleDateString()) {
                label = 'Yesterday'
            }
            
            result.push(
                <div key={`date-${dateString}-${index}`} className="date-separator">
                    <span className="date-pill">{label}</span>
                </div>
            )
            lastDate = dateString
        }
        
        result.push(
            <div
                key={msg.id}
                id={`msg-${msg.id}`}
                className={`client-message-wrapper ${msg.sender_id === user.id ? 'sent' : 'received'}`}
                onMouseEnter={() => setHoveredMessageId(msg.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={() => onTouchEnd(msg)}
            >
                <div className={`reply-trigger-icon`}>
                    <Reply className="w-4 h-4" />
                </div>
                {renderMessageBubble(msg)}
            </div>
        )
    })
    return result
  }

  const renderMenu = (msg, isOwnMessage) => {
      // Only show menu for own messages and if not deleted (except Reply)
      if (msg.is_deleted) return null

      const isOwner = msg.sender_id === user.id
      const isWithinTimeLimit = (new Date() - new Date(msg.created_at)) < 5 * 60 * 1000

      // Only show menu button if there are actions available (Reply is always avail)
      
      return (
          <div className={`absolute top-0 ${isOwnMessage ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
              <div className="relative">
                  <button 
                    className="message-menu-btn p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"
                    onClick={(e) => {
                        e.stopPropagation()
                        setActiveMenuId(activeMenuId === msg.id ? null : msg.id)
                    }}
                   >
                      <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {activeMenuId === msg.id && (
                      <div className="message-menu-dropdown absolute bottom-full mb-1 right-0 w-32 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                          <button 
                                className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setReplyingTo(msg)
                                    setActiveMenuId(null)
                                    inputRef.current?.focus()
                                }}
                            >
                                <Reply className="w-3 h-3" /> Reply
                          </button>
                          
                          {isOwner && isWithinTimeLimit && !msg.content.startsWith('[IMAGE]') && !msg.content.startsWith('[FILE]') && (
                                <button 
                                    className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setEditingMessageId(msg.id)
                                        setEditContent(msg.content)
                                        setActiveMenuId(null)
                                    }}
                                >
                                    <Edit2 className="w-3 h-3" /> Edit
                                </button>
                          )}
                          
                          {isOwner && isWithinTimeLimit && (
                              <button 
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDeleteMessage(msg.id)
                                    setActiveMenuId(null)
                                }}
                              >
                                 <Trash className="w-3 h-3" /> Delete
                              </button>
                          )}
                      </div>
                  )}
              </div>
          </div>
      )
  }



  const handlePaste = (e) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            e.preventDefault()
            const file = items[i].getAsFile()
            if (file) {
                // Set pending state instead of immediate upload
                setPendingFile(file)
                const url = URL.createObjectURL(file)
                setPreviewUrl(url)
            }
            return
        }
    }
  }

  const handleCancelPreview = () => {
    setPendingFile(null)
    setPreviewUrl(null)
  }

  return (
    <div className="client-chat-container relative">
      <ImageModal 
        isOpen={!!selectedImage} 
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
      
      <div className="client-chat-header">
        <div className="flex items-center gap-3 flex-1">
          <button 
              className="client-mobile-menu-btn md:hidden" 
              onClick={onOpenMobileMenu}
          >
              <Menu className="h-6 w-6" />
          </button>
          
           <div className="relative">
             <div className="client-avatar-container">
               <span className="client-avatar">N</span>
             </div>
             <span className={`client-status-dot ${isAdminOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
           </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
                <h2 className="intern-chat-name">Support Team</h2>
                <Star className="w-4 h-4 text-blue-500 fill-blue-500" />
            </div>
            <span className={`client-status-text ${isAdminOnline ? 'text-green-400' : 'text-gray-500'}`}>
                {isAdminOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

      </div>

      <div className="client-chat-body">
        {/* ... */}
        {renderMessagesWithDates()}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={async (e) => {
            e.preventDefault() // Fix: prevent default form submission which might cause double sends

            if (pendingFile) {
                await onFileUpload(pendingFile)
                setPendingFile(null)
                setPreviewUrl(null)
                setReplyingTo(null)
            }
            
            if (newMessage.trim() && !isSending) {
                setIsSending(true)
                try {
                    // Update: Pass replyingTo?.id
                    await onSendMessage(e, replyingTo?.id)
                    setReplyingTo(null)
                } finally {
                    setIsSending(false)
                }
            }
            
            // Force focus back to input to keep keyboard open on mobile
            setTimeout(() => inputRef.current?.focus(), 10)
        }} 
        className="client-input-form relative !flex-col !items-stretch !gap-0 !pb-2"
      >
        {previewUrl && (
            <div className="absolute bottom-full left-4 mb-2 p-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2">
                <div className="relative">
                    <img src={previewUrl} alt="Preview" className="h-32 w-auto rounded-md object-cover border border-slate-600" />
                    <button 
                        type="button"
                        onClick={handleCancelPreview}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}
        
        {/* Reply Preview Component */}
        <ReplyPreview replyingTo={replyingTo} onCancel={() => setReplyingTo(null)} />

        <div className="flex items-end gap-2 w-full pt-2 border-t border-transparent">

            {/* Hidden File Inputs */}
            <input 
                type="file" 
                ref={imageInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
            />
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
            />

            {/* Plus Menu Button */}
            <div className="relative plus-menu-container">
                 <button
                   type="button"
                   onClick={(e) => {
                       e.stopPropagation()
                       setShowPlusMenu(!showPlusMenu)
                   }}
                   className="client-upload-btn text-gray-400 hover:text-white"
                 >
                   <CirclePlus className={`h-6 w-6 transition-transform ${showPlusMenu ? 'rotate-45' : ''}`} />
                 </button>

                 {/* Plus Menu Popup */}
                 {showPlusMenu && (
                     <div className="absolute bottom-12 left-0 bg-[#1e293b] border border-slate-700 rounded-xl shadow-xl p-2 w-48 z-50 animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-1">
                         <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg text-left transition-colors"
                         >
                            <div className="bg-purple-500/20 p-2 rounded-full">
                                 <ImageIcon className="w-4 h-4 text-purple-400" />
                            </div>
                            <span className="text-sm text-slate-200 font-medium">Photos & Videos</span>
                         </button>
                         <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg text-left transition-colors"
                         >
                            <div className="bg-blue-500/20 p-2 rounded-full">
                                 <FileText className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="text-sm text-slate-200 font-medium">Document</span>
                         </button>
                     </div>
                 )}
            </div>

            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="Type a message..."
              className="client-input-field"
              rows={1}
            />
            <button
              type="submit"
              disabled={(!newMessage.trim() && !pendingFile) || isSending}
              className={`client-send-btn ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onTouchStart={(e) => e.preventDefault()} // Critical for mobile touch focus preservation
            >
              <Send className="h-5 w-5" />
            </button>
        </div>
      </form>
    </div>
  )
}
