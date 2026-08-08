'use client'

import React, { useEffect } from 'react'
import { X, ExternalLink, Download } from 'lucide-react'

interface LightboxViewerProps {
  isOpen: boolean
  imageUrl: string
  title?: string
  subtitle?: string
  onClose: () => void
}

export function LightboxViewer({
  isOpen,
  imageUrl,
  title = 'Prescription Document',
  subtitle,
  onClose,
}: LightboxViewerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !imageUrl) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200">
      {/* Lightbox Header */}
      <div className="flex items-center justify-between gap-4 text-white z-10">
        <div className="min-w-0">
          <h3 className="font-bold text-sm sm:text-base truncate">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-300 truncate">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {imageUrl.startsWith('http') && (
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Open full resolution in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="flex-1 flex items-center justify-center py-4 px-1 min-h-0 cursor-zoom-out"
        onClick={onClose}
      >
        <img
          src={imageUrl}
          alt={title}
          onClick={(e) => e.stopPropagation()} // Prevent close on image click
          className="max-h-[82vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform"
        />
      </div>

      {/* Lightbox Footer Caption */}
      <div className="text-center text-xs text-slate-400 py-1">
        Tap background or press ESC to exit viewer
      </div>
    </div>
  )
}
