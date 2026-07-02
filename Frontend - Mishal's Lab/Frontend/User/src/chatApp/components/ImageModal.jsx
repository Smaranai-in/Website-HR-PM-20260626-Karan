import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function ImageModal({ isOpen, imageUrl, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      // 1. Push history state so Back button catches it
      window.history.pushState({ modalOpen: true }, '', window.location.href)
      
      const handlePopState = () => {
        // 2. Browser Back was pressed -> Close modal
        onClose()
      }

      document.addEventListener('keydown', handleEsc)
      window.addEventListener('popstate', handlePopState)
      document.body.style.overflow = 'hidden'

      return () => {
        // Cleanup
        document.removeEventListener('keydown', handleEsc)
        window.removeEventListener('popstate', handlePopState)
        document.body.style.overflow = 'unset'

        // 3. If standard Close (X button) was used, the history state is still there.
        // We need to remove it manually.
        // If Back Button was used, we are already back (state is popped).
        if (window.history.state?.modalOpen) {
             window.history.back()
        }
      }
    }
  }, [isOpen, onClose])

  if (!isOpen || !imageUrl) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        onClick={onClose}
      >
        <X className="h-8 w-8" />
      </button>
      
      <div 
        className="relative max-w-full max-h-full overflow-hidden flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking image itself? Actually user might want to close by clicking anywhere. Let's keep it close on click for now, or maybe only close on backdrop.
      >
        <img 
          src={imageUrl} 
          alt="Full screen preview" 
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-zoom-in"
          style={{ animation: 'zoomIn 0.3s ease-out' }}
        />
      </div>
    </div>
  )
}
