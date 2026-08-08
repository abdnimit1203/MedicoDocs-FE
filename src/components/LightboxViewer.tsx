'use client'

import React, { useState, useEffect, useRef } from 'react'
import { X, ExternalLink, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

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
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const initialTouchDistanceRef = useRef<number | null>(null)
  const initialTouchScaleRef = useRef<number>(1)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === '+' || e.key === '=') handleZoomIn()
      if (e.key === '-') handleZoomOut()
      if (e.key === '0') handleResetZoom()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleClose = () => {
    handleResetZoom()
    onClose()
  }

  const handleResetZoom = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4))
  }

  const handleZoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1)
      if (next === 1) setPosition({ x: 0, y: 0 })
      return next
    })
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  const handleDoubleClick = () => {
    if (scale > 1) {
      handleResetZoom()
    } else {
      setScale(2.5)
    }
  }

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Mobile Pinch Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      initialTouchDistanceRef.current = dist
      initialTouchScaleRef.current = scale
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true)
      dragStartRef.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialTouchDistanceRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const factor = dist / initialTouchDistanceRef.current
      const newScale = Math.min(Math.max(initialTouchScaleRef.current * factor, 1), 4)
      setScale(newScale)
      if (newScale === 1) setPosition({ x: 0, y: 0 })
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStartRef.current.x,
        y: e.touches[0].clientY - dragStartRef.current.y,
      })
    }
  }

  const handleTouchEnd = () => {
    initialTouchDistanceRef.current = null
    setIsDragging(false)
  }

  if (!isOpen || !imageUrl) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none">
      {/* Lightbox Header */}
      <div className="flex items-center justify-between gap-4 text-white z-20">
        <div className="min-w-0">
          <h3 className="font-bold text-sm sm:text-base truncate">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-300 truncate">{subtitle}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom Controls Toolbar */}
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/15">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 1}
              className="p-1.5 rounded-full hover:bg-white/20 text-white disabled:opacity-40 transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-bold text-slate-200 px-1 min-w-[36px] text-center">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              disabled={scale >= 4}
              className="p-1.5 rounded-full hover:bg-white/20 text-white disabled:opacity-40 transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {scale > 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded-full hover:bg-white/20 text-cyan-300 transition-colors"
                title="Reset Zoom (0)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

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
            onClick={handleClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Close viewer (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage with Zoom & Pan */}
      <div
        className="flex-1 flex items-center justify-center py-4 px-1 min-h-0 overflow-hidden relative"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={imageUrl}
          alt={title}
          onDoubleClick={handleDoubleClick}
          className={`max-h-[82vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-150 ${
            scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
          }`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
          }}
        />
      </div>

      {/* Lightbox Footer Instructions */}
      <div className="text-center text-xs text-slate-400 py-1 flex items-center justify-center gap-3">
        <span>Use <strong className="text-slate-200">+ / -</strong> or double-tap to zoom</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">Pinch / drag to pan</span>
      </div>
    </div>
  )
}
