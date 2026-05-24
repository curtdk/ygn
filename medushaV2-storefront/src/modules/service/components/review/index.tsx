"use client"

import { useState } from "react"
import { Button, Textarea, clx } from "@medusajs/ui"
import { Star } from "@medusajs/icons"

interface ServiceReviewFormProps {
  orderId: string
  onSubmit?: () => void
}

export default function ServiceReviewForm({ orderId, onSubmit }: ServiceReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch(`/store/service-orders/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`,
        },
        body: JSON.stringify({
          action: "review",
          rating,
          comment,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "评价提交失败")
      }

      setMessage({ type: "success", text: "评价提交成功！" })
      setComment("")
      onSubmit?.()
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">服务评价</h2>
      
      <p className="text-gray-600 mb-6">
        请对本次服务进行评价，您的反馈将帮助我们改进服务质量。
      </p>

      {message && (
        <div className={clx(
          "px-4 py-3 rounded mb-4",
          message.type === "success" ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
        )}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            服务评分
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {rating === 5 ? "非常满意" : rating === 4 ? "满意" : rating === 3 ? "一般" : rating === 2 ? "不满意" : "非常不满意"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            评价内容
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="请分享您的服务体验..."
            className="w-full min-h-[120px]"
            maxLength={500}
          />
          <p className="text-sm text-gray-500 mt-1 text-right">
            {comment.length}/500
          </p>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "提交中..." : "提交评价"}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-sm text-gray-500">
        <p>评价须知：</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>评价提交后将无法修改</li>
          <li>真实客观的评价有助于其他用户做出选择</li>
          <li>我们会认真对待每一条反馈</li>
        </ul>
      </div>
    </div>
  )
}