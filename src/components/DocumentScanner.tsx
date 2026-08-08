'use client'

import React, { useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchWithAuth } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { Camera, Upload, RotateCw, Check, X, Loader2, AlertCircle } from 'lucide-react'

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
  const { getToken } = useAuth()

  const [imageSrc, setImageSrc] = useState<string | null>(initialImage?.url || null)
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(initialImage?.thumbnail || null)
  const [rotation, setRotation] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelected = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return
    setIsProcessing(true)
    setUploadError(null)

    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          processAndUploadImage(img, 0)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    } catch (err: any) {
      console.error('Image processing failed:', err)
      setUploadError(err.message || 'Failed to read image file.')
      setIsProcessing(false)
    }
  }

  const processAndUploadImage = async (img: HTMLImageElement, angle: number) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not create canvas context.')

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

      // Upload base64 compressed image to ImageKit via backend endpoint
      const token = await getToken()
      const uploadRes = await fetchWithAuth('/records/upload-image', token, {
        method: 'POST',
        body: JSON.stringify({
          file: fullQualityUrl,
          fileName: `prescription_${Date.now()}.jpg`,
        }),
      })

      if (uploadRes.success && uploadRes.data?.url) {
        const ikData = uploadRes.data
        setImageSrc(ikData.url)
        setThumbnailSrc(ikData.thumbnail || ikData.url)
        onImageCaptured({
          url: ikData.url,
          thumbnail: ikData.thumbnail || ikData.url,
          dimensions: ikData.dimensions || { width, height },
        })
        toast.success('Document image uploaded to ImageKit!')
      } else {
        throw new Error(uploadRes.error?.message || 'ImageKit upload failed.')
      }
    } catch (err: any) {
      console.error('ImageKit upload error:', err)
      const errText = err.message || 'Failed to upload image to ImageKit cloud CDN.'
      setUploadError(errText)
      toast.error(errText)
      setImageSrc(null)
      setThumbnailSrc(null)
      onImageCaptured({ url: '', thumbnail: '', dimensions: { width: 0, height: 0 } })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRotate = () => {
    if (!imageSrc) return
    const newRotation = (rotation + 90) % 360
    setRotation(newRotation)
  }

  const handleRemove = () => {
    setImageSrc(null)
    setThumbnailSrc(null)
    setRotation(0)
    setUploadError(null)
    onImageCaptured({ url: '', thumbnail: '', dimensions: { width: 0, height: 0 } })
  }

  return (
    <div className="space-y-2 w-full max-w-full">
      <label className="block text-xs font-semibold text-[#17201D]">
        Prescription / Document Image
      </label>

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

      {uploadError && (
        <div className="p-3 bg-[#F8E9EC] border border-[#8F1D2C]/30 rounded-xl text-xs text-[#8F1D2C] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">ImageKit CDN Upload Error:</span>
            <span>{uploadError}</span>
          </div>
        </div>
      )}

      {isProcessing ? (
        <div className="h-32 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-2 text-[#68736F]">
          <Loader2 className="w-6 h-6 animate-spin text-[#8F1D2C]" />
          <span className="text-xs font-semibold">Uploading to ImageKit Cloud CDN...</span>
        </div>
      ) : imageSrc ? (
        <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-2 overflow-hidden flex flex-col items-center gap-2 w-full">
          <div className="max-h-48 w-full flex items-center justify-center overflow-hidden rounded-lg bg-white border border-slate-200">
            <img
              src={imageSrc}
              alt="Prescription document"
              className="max-h-48 object-contain rounded transition-transform duration-200"
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </div>

          <div className="flex items-center gap-2 w-full justify-between pt-1 border-t border-slate-200">
            <button
              type="button"
              onClick={handleRotate}
              className="flex items-center gap-1 text-[11px] text-[#17201D] bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded-md transition-colors"
            >
              <RotateCw className="w-3 h-3 text-[#8F1D2C]" />
              <span>Rotate</span>
            </button>

            <span className="text-[10px] text-[#20A878] font-bold flex items-center gap-1 truncate max-w-[180px]">
              <Check className="w-3 h-3 shrink-0" /> ImageKit Uploaded
            </span>

            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="h-20 rounded-xl border border-dashed border-slate-300 hover:border-[#8F1D2C] bg-white hover:bg-slate-50 flex flex-col items-center justify-center gap-1.5 text-[#17201D] transition-all group"
          >
            <Camera className="w-5 h-5 text-[#8F1D2C] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Take Photo</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-20 rounded-xl border border-dashed border-slate-300 hover:border-[#8F1D2C] bg-white hover:bg-slate-50 flex flex-col items-center justify-center gap-1.5 text-[#17201D] transition-all group"
          >
            <Upload className="w-5 h-5 text-[#8F1D2C] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Upload File</span>
          </button>
        </div>
      )}
    </div>
  )
}
