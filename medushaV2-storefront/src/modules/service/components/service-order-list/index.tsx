"use client"

import { useEffect, useState } from "react"
import { Container, Badge, clx } from "@medusajs/ui"

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
}

export default function ServiceOrderList({ onOrderClick }: ServiceOrderListProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/store/service-orders", {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        throw new Error("Failed to load orders")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载订单失败")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return styles[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: "待接单",
      accepted: "已接单",
      in_progress: "服务中",
      completed: "已完成",
      cancelled: "已取消",
    }
    return texts[status] || status
  }

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
        <div className="text-red-500 text-center">{error}</div>
      </Container>
    )
  }

  if (orders.length === 0) {
    return (
      <Container className="py-8">
        <div className="text-center text-gray-500">
          <p>暂无服务订单</p>
          <p className="text-sm mt-2">浏览服务产品，开始您的第一次购买</p>
        </div>
      </Container>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          onClick={() => onOrderClick?.(order)}
          className={clx(
            "bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-orange-300 transition-colors",
            onOrderClick && "cursor-pointer"
          )}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-sm text-gray-500 mb-2">
                订单号: {order.id.slice(0, 8)}...
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusBadge(order.status)}>
                  {getStatusText(order.status)}
                </Badge>
                {order.rating && (
                  <span className="text-yellow-500">
                    {"★".repeat(order.rating)}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                创建时间: {new Date(order.created_at).toLocaleDateString()}
              </div>
            </div>
            {order.result_url && (
              <img
                src={order.result_url}
                alt="结果预览"
                className="w-16 h-16 object-cover rounded"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}