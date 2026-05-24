"use client"

import React, { useState, useEffect } from "react"
import { Button, Input, clx } from "@medusajs/ui"

interface ReferralData {
  referral_code: string
  referrals_count: number
  referrer: any
}

const ReferralCode = () => {
  const [code, setCode] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [data, setData] = useState<ReferralData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadReferralInfo()
  }, [])

  const loadReferralInfo = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/store/referrals", {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`,
        },
      })
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (err) {
      console.error("Failed to load referral info:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBindCode = async () => {
    if (!code.trim()) {
      setMessage({ type: "error", text: "请输入推荐码" })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch("/store/referrals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`,
        },
        body: JSON.stringify({ referral_code: code }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "绑定失败")
      }

      setMessage({ type: "success", text: "推荐码绑定成功！" })
      setCode("")
      await loadReferralInfo()
    } catch (err: any) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="p-4">加载中...</div>
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">我的推荐码</h2>
      
      <div className="mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-1">您的推荐码</p>
          <p className="text-2xl font-mono font-bold text-primary">{data?.referral_code || "未生成"}</p>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <span>已推荐人数：</span>
          <span className="font-semibold">{data?.referrals_count || 0}</span>
        </div>
      </div>

      {message && (
        <div className={clx(
          "px-4 py-3 rounded mb-4",
          message.type === "success" ? "bg-green-50 text-green-600 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
        )}>
          {message.text}
        </div>
      )}

      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-medium mb-3">绑定推荐码</h3>
        <p className="text-sm text-gray-500 mb-3">输入朋友分享的推荐码，建立推荐关系</p>
        
        <div className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="请输入推荐码"
            className="flex-1"
          />
          <Button 
            onClick={handleBindCode} 
            disabled={isSubmitting || data?.referrer}
          >
            {isSubmitting ? "绑定中..." : "绑定"}
          </Button>
        </div>

        {data?.referrer && (
          <p className="text-sm text-gray-500 mt-2">您已绑定推荐关系</p>
        )}
      </div>
    </div>
  )
}

export default ReferralCode