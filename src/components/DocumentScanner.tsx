'use client'

import React, { useState, useRef } from 'react'
import { Camera, Upload, RotateCw, Check, X, Loader2, FileImage } from 'lucide-react'

interface DocumentScannerProps {
  initialImage?: {
    url?: string
    thumbnail?: string
    dimensions?: { width?: number; height?: number }
  }
  onImageCaptured: (imageRef: {
    url: string
    thumbnail: string
    dimensions: { width: number; height: number }
  }) => void
}

export function DocumentScanner({ initialImage, onImageCaptured }: DocumentScannerProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(initialImage?.url || null)
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(initialImage?.thumbnail || null)
  const [rotation, setRotation] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelected = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return
    setIsProcessing(true)

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          processAndResizeImage(img, 0)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Image processing failed:', err)
      setIsProcessing(false)
    }
  }

  const processAndResizeImage = (img: HTMLImageElement, angle: number) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Max dimensions for medical document preview while keeping high readability
    const MAX_WIDTH = 1200
    const MAX_HEIGHT = 1600
    let width = img.width
    let height = img.height

    if (width > height) {
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width)
        width = MAX_WIDTH
      }
    } else {
      if (height > MAX_HEIGHT) {
        width = Math.round((width * MAX_HEIGHT) / height)
        height = MAX_HEIGHT
      }
    }

    canvas.width = width
    canvas.height = height

    if (angle !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((angle * Math.PI) / 180)
      ctx.drawImage(img, -width / 2, -height / 2, width, height)
    } else {
      ctx.drawImage(img, 0, 0, width, height)
    }

    const fullQualityUrl = canvas.toDataURL('image/jpeg', 0.85)

    // Generate small thumbnail canvas
    const thumbCanvas = document.createElement('canvas')
    const thumbCtx = thumbCanvas.getContext('2d')
    const THUMB_SIZE = 200
    thumbCanvas.width = THUMB_SIZE
    thumbCanvas.height = THUMB_SIZE

    if (thumbCtx) {
      thumbCtx.drawImage(canvas, 0, 0, THUMB_SIZE, THUMB_SIZE)
    }
    const thumbUrl = thumbCanvas.toDataURL('image/jpeg', 0.7)

    setImageSrc(fullQualityUrl)
    setThumbnailSrc(thumbUrl)
    setIsProcessing(false)

    onImageCaptured({
      url: fullQualityUrl,
      thumbnail: thumbUrl,
      dimensions: { width, height },
    })
  }

  const handleRotate = () => {
    if (!imageSrc) return
    const newRotation = (rotation + 90) % 360
    setRotation(newRotation)

    const img = new Image()
    img.onload = () => {
      processAndResizeImage(img, newRotation)
    }
    img.src = imageSrc
  }

  const handleRemove = () => {
    setImageSrc(null)
    setThumbnailSrc(null)
    setRotation(0)
    onImageCaptured({ url: '', thumbnail: '', dimensions: { width: 0, height: 0 } })
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300">
        Prescription / Document Image
      </label>

      {/* Hidden native input elements for camera & file picker */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
      />

      {isProcessing ? (
        <div className="h-32 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-teal-400" />
          <span className="text-xs">Processing document image...</span>
        </div>
      ) : imageSrc ? (
        <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-2 overflow-hidden flex flex-col items-center gap-2">
          <div className="max-h-48 w-full flex items-center justify-center overflow-hidden rounded-lg bg-slate-900">
            <img
              src={imageSrc}
              alt="Prescription document"
              className="max-h-48 object-contain rounded transition-transform duration-200"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </div>

          <div className="flex items-center gap-2 w-full justify-between pt-1 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleRotate}
              className="flex items-center gap-1 text-[11px] text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition-colors"
            >
              <RotateCw className="w-3 h-3 text-teal-400" />
              <span>Rotate</span>
            </button>

            <span className="text-[10px] text-teal-400 font-mono flex items-center gap-1">
              <Check className="w-3 h-3" /> Scanned & Compressed
            </span>

            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded-md transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="h-20 rounded-xl border border-dashed border-slate-800 hover:border-teal-500/50 bg-slate-900/40 hover:bg-slate-800/60 flex flex-col items-center justify-center gap-1.5 text-slate-300 transition-all group"
          >
            <Camera className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Take Photo</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-20 rounded-xl border border-dashed border-slate-800 hover:border-teal-500/50 bg-slate-900/40 hover:bg-slate-800/60 flex flex-col items-center justify-center gap-1.5 text-slate-300 transition-all group"
          >
            <Upload className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Upload File</span>
          </button>
        </div>
      )}
    </div>
  )
}
