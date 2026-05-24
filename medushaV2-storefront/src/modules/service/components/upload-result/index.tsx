"use client"

import { useState, useRef } from "react"
import { Button, Input, clx } from "@medusajs/ui"
import { ArrowUpTray as Upload, X, Image as ImageIcon } from "@medusajs/icons"

interface UploadResultFormProps {
  orderId: string
  onSubmit: (resultUrl: string, resultThumbnail?: string) => Promise<void>
  onCancel?: () => void
}

export default function UploadResultForm({ orderId, onSubmit, onCancel }: UploadResultFormProps) {
  const [resultUrl, setResultUrl] = useState("")
  const [resultThumbnail, setResultThumbnail] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploading(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("文件上传失败")
      }

      const data = await response.json()
      const url = data.url || data.file_url || data.public_url

      if (url) {
        setResultUrl(url)
        setPreviewUrl(url)
        
        // If it's an image, use same URL for thumbnail
        if (file.type.startsWith("image/")) {
          setResultThumbnail(url)
        }
      } else {
        throw new Error("上传成功但未获取到文件URL")
      }
    } catch (err: any) {
      setError(err.message || "上传失败")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resultUrl) {
      setError("请上传服务结果文件")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(resultUrl, resultThumbnail || undefined)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">上传服务结果</h2>
      
      <p className="text-gray-600 mb-6">
        请上传完成的服务结果文件（图片、视频或文档）
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors cursor-pointer"
          onClick={triggerFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-500">上传中...</p>
            </div>
          ) : resultUrl ? (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-xs mx-auto">
                {previewUrl && (
                  previewUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img 
                      src={previewUrl} 
                      alt="预览" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )
                )}
              </div>
              <p className="mt-4 text-green-600 font-medium">上传成功！</p>
              <p className="text-sm text-gray-500 mt-1">点击可重新上传</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400" />
              <p className="mt-4 text-gray-600">点击上传文件</p>
              <p className="text-sm text-gray-500 mt-1">
                支持图片、视频、PDF、Word文档
              </p>
            </div>
          )}
        </div>

        {/* Manual URL Input (Alternative) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            或直接输入文件URL
          </label>
          <Input
            value={resultUrl}
            onChange={(e) => {
              setResultUrl(e.target.value)
              setPreviewUrl(e.target.value)
            }}
            placeholder="https://example.com/result.jpg"
            className="w-full"
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            缩略图URL（可选）
          </label>
          <Input
            value={resultThumbnail}
            onChange={(e) => setResultThumbnail(e.target.value)}
            placeholder="https://example.com/thumb.jpg"
            className="w-full"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || !resultUrl}
            className="flex-1"
          >
            {isSubmitting ? "提交中..." : "确认完成"}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="px-6"
            >
              取消
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}