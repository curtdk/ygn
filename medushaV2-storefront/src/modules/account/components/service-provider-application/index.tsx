"use client"

import { useState } from "react"
import { Button, Input, clx } from "@medusajs/ui"

interface ApplicationFormData {
  phone: string
  id_card_front: string
  id_card_back: string
}

export default function ServiceProviderApplication() {
  const [formData, setFormData] = useState<ApplicationFormData>({
    phone: "",
    id_card_front: "",
    id_card_back: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.phone.trim()) {
      setMessage({ type: "error", text: "请输入联系电话" })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch("/store/service-providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`,
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "申请提交失败")
      }

      setMessage({ type: "success", text: "申请已提交，等待审核！" })
      setFormData({ phone: "", id_card_front: "", id_card_back: "" })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">申请成为服务商</h2>
      
      <p className="text-gray-600 mb-6">
        填写以下信息提交服务商申请，审核通过后您将可以提供服务并获取收入。
      </p>

      {message && (
        <div className={clx(
          "px-4 py-3 rounded mb-4",
          message.type === "success" ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
        )}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            联系电话 <span className="text-red-500">*</span>
          </label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="请输入手机号码"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            身份证正面照片
          </label>
          <Input
            name="id_card_front"
            value={formData.id_card_front}
            onChange={handleChange}
            placeholder="上传身份证正面图片URL"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            身份证背面照片
          </label>
          <Input
            name="id_card_back"
            value={formData.id_card_back}
            onChange={handleChange}
            placeholder="上传身份证背面图片URL"
            className="w-full"
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "提交中..." : "提交申请"}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-sm text-gray-500">
        <p>申请须知：</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>提交申请后需要等待管理员审核</li>
          <li>审核结果将通过系统通知您</li>
          <li>服务商可获得订单收入和服务佣金</li>
        </ul>
      </div>
    </div>
  )
}