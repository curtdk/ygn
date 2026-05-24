"use client"

import { useEffect, useState } from "react"
import { Container, clx } from "@medusajs/ui"

interface ProviderOrderListProps {
  onOrderClick?: (order: any) => void
  onGrabOrder?: (order: any) => void
}

interface Order {
  id: string
  service_product_id: string
  status: string
  created_at: string
  customer_id: string
  provider_id: string | null
  result_url?: string
  rating?: number
  service_address?: string
  service_date?: string
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

export default function ProviderOrderList({ onOrderClick, onGrabOrder }: ProviderOrderListProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<"grab" | "mine">("grab")
  const [grabbingId, setGrabbingId] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/store/service-orders/provider", {
        credentials: "include",
      })
      if (!res.ok) throw new Error("加载失败")
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载订单失败")
    } finally {
      setLoading(false)
    }
  }

  const handleGrab = async (e: React.MouseEvent, order: Order) => {
    e.stopPropagation()
    if (!onGrabOrder) return
    setGrabbingId(order.id)
    try {
      await onGrabOrder(order)
    } finally {
      setGrabbingId(null)
    }
  }

  const grabOrders = orders.filter((o) => o.status === "pending" && !o.provider_id)
  const myOrders = orders.filter((o) => o.provider_id || o.status !== "pending")
  const displayOrders = tab === "grab" ? grabOrders : myOrders

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center">
          <div className="animate-pulse text-gray-500">加载中...</div>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button onClick={loadOrders} className="mt-2 text-sm text-blue-500 hover:underline">重新加载</button>
        </div>
      </Container>
    )
  }

  return (
    <div>
      {/* 子 Tab */}
      <div className="flex gap-3 mb-4 border-b">
        <button
          onClick={() => setTab("grab")}
          className={clx(
            "pb-3 px-2 text-sm font-medium border-b-2 transition-colors",
            tab === "grab" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500"
          )}
        >
          抢单池 ({grabOrders.length})
        </button>
        <button
          onClick={() => setTab("mine")}
          className={clx(
            "pb-3 px-2 text-sm font-medium border-b-2 transition-colors",
            tab === "mine" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500"
          )}
        >
          我的接单 ({myOrders.length})
        </button>
      </div>

      {displayOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {tab === "grab" ? (
            <>
              <p className="text-base">暂无可抢订单</p>
              <p className="text-sm mt-1">有新订单时会在这里显示</p>
            </>
          ) : (
            <>
              <p className="text-base">暂无接单记录</p>
              <p className="text-sm mt-1">前往抢单池抢接订单</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => onOrderClick?.(order)}
              className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-mono text-xs text-gray-400 mb-2">
                    #{order.id.slice(0, 8)}
                  </div>
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
                    <p className="text-sm text-gray-600 mb-1">📅 {order.service_date}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleString("zh-CN")}
                  </p>
                </div>
                {order.result_url && (
                  <img
                    src={order.result_url}
                    alt="凭证"
                    className="w-16 h-16 object-cover rounded ml-3"
                  />
                )}
              </div>

              {/* 抢单按钮 */}
              {tab === "grab" && order.status === "pending" && !order.provider_id && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => handleGrab(e, order)}
                    disabled={grabbingId === order.id}
                    className="w-full bg-blue-500 text-white py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  >
                    {grabbingId === order.id ? "抢单中..." : "立即抢单"}
                  </button>
                </div>
              )}

              {/* 服务中提示 */}
              {tab === "mine" && (order.status === "accepted" || order.status === "in_progress") && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-center text-orange-500">
                    {order.status === "accepted" ? "点击查看详情 → 上传到场凭证" : "点击查看详情 → 提交服务结果"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
