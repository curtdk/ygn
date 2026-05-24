"use client"

import { useEffect, useState } from "react"
import { Container, clx } from "@medusajs/ui"

interface ServiceOrderListProps {
  onOrderClick?: (order: any) => void
}

interface Order {
  id: string
  service_product_id: string
  status: string
  created_at: string
  result_url?: string
  rating?: number
  service_address?: string
  service_date?: string
  provider_id?: string | null
}

const STATUS_TEXT: Record<string, string> = {
  pending: "待接单",
  accepted: "已接单",
  in_progress: "服务中",
  completed: "已完成",
  cancelled: "已取消",
  disputed: "有争议",
}

const STATUS_CLASS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  disputed: "bg-orange-100 text-orange-800",
}

export default function ServiceOrderList({ onOrderClick }: ServiceOrderListProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/store/service-orders", {
        credentials: "include",
      })
      if (!response.ok) throw new Error("加载失败，请确认已登录")
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载订单失败")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button onClick={loadOrders} className="mt-2 text-sm text-blue-500 hover:underline">重新加载</button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-base">暂无服务订单</p>
        <p className="text-sm mt-1">浏览服务产品，开始您的第一次购买</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onOrderClick?.(order)}
          className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="font-mono text-xs text-gray-400 mb-2">#{order.id.slice(0, 8)}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className={clx("px-2 py-0.5 rounded text-xs", STATUS_CLASS[order.status])}>
                  {STATUS_TEXT[order.status] || order.status}
                </span>
                {order.rating && (
                  <span className="text-yellow-500 text-xs">
                    {"★".repeat(order.rating)}{"☆".repeat(5 - order.rating)}
                  </span>
                )}
              </div>
              {order.service_address && (
                <p className="text-sm text-gray-600 mb-1">📍 {order.service_address}</p>
              )}
              {order.service_date && (
                <p className="text-sm text-gray-500 mb-1">📅 {order.service_date}</p>
              )}
              {!order.provider_id && order.status === "pending" && (
                <p className="text-xs text-orange-400 mt-1">等待服务商接单...</p>
              )}
              {order.status === "completed" && !order.rating && (
                <p className="text-xs text-blue-500 mt-1">点击评价服务</p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {new Date(order.created_at).toLocaleString("zh-CN")}
              </p>
            </div>
            {order.result_url && (
              <img
                src={order.result_url}
                alt="服务凭证"
                className="w-16 h-16 object-cover rounded ml-3"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
