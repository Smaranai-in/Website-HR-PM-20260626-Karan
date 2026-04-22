import React from 'react'
import { X, Image as ImageIcon, FileText } from 'lucide-react'

export default function ReplyPreview({ replyingTo, onCancel }) {
  if (!replyingTo) return null

  const isImage = replyingTo.content.startsWith('[IMAGE] ')
  const isFile = replyingTo.content.startsWith('[FILE] ')
  
  let content = replyingTo.content
  let ThumbnailIcon = null

  if (isImage) {
      content = "Photo"
      ThumbnailIcon = ImageIcon
  } else if (isFile) {
      const parts = replyingTo.content.replace('[FILE] ', '').split('|')
      content = parts[1] || "Document"
      ThumbnailIcon = FileText
  }

  // Determine border color based on sender (simple hash or uniform for now)
  // In a real app we might pass the color. For now, hardcode a nice accent.
  const borderColor = "border-l-4 border-purple-500"

  return (
    <div className={`reply-preview-container flex items-center justify-between p-2 mb-1 bg-[#1e293b] rounded-t-lg mx-2 border-t border-x border-[#334155] animate-in slide-in-from-bottom-2 fade-in relative z-10 ${borderColor}`}>
      <div className="flex-1 min-w-0 pl-2">
           <div className="flex items-center gap-2 mb-0.5">
               <span className="text-xs font-bold text-purple-400 truncate">
                   {replyingTo.sender_name || "User"}
               </span>
           </div>
           <div className="flex items-center gap-2 text-sm text-slate-300">
               {ThumbnailIcon && <ThumbnailIcon className="w-3 h-3" />}
               <span className="truncate">{content}</span>
           </div>
      </div>
      
      <div className="flex items-center gap-2 ml-2">
           {isImage && (
               <img 
                 src={replyingTo.content.replace('[IMAGE] ', '')} 
                 alt="Preview" 
                 className="w-10 h-10 object-cover rounded"
               />
           )}
           <button 
             onClick={onCancel}
             className="p-1 hover:bg-slate-700 rounded-full transition-colors"
           >
               <X className="w-5 h-5 text-slate-400" />
           </button>
      </div>
    </div>
  )
}
