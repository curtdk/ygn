"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"

export default function RechargeSuccessPage() {
  const router = useRouter()
  const params = useParams()
  const countryCode = params.countryCode as string
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取最新余额
    const API_BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

    fetch(`${API_BASE_URL}/store/user/balance`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY
      },
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      setBalance(data.balance || 0)
      setLoading(false)
    })
    .catch(error => {
      console.error('获取余额失败:', error)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">充值成功！</h1>
          <p className="text-gray-600 mb-6">您的积分已到账</p>

          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 mb-6">
            <p className="text-white text-sm mb-2">当前余额</p>
            {loading ? (
              <p className="text-white text-4xl font-bold">...</p>
            ) : (
              <p className="text-white text-4xl font-bold">{balance}</p>
            )}
            <p className="text-white text-sm mt-1">积分</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push(`/${countryCode}/ygn/home`)}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow"
            >
              返回首页
            </button>
            <button
              onClick={() => router.push(`/${countryCode}/ygn/recharge`)}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              继续充值
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
