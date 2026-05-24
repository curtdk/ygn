"use client"

import { useEffect, useState } from "react"
import { Container } from "@medusajs/ui"
import { Button } from "@medusajs/ui"

interface ServiceOrder {
  id: string
  service_product_id: string
  status: string
  requirements: any
  created_at: string
  provider: any
  service_product: any
}

export default function ServiceOrderList() {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)

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
        const result = await response.json()
        setOrders(result.orders || [])
      }
    } catch (err) {
      console.error("Failed to load orders:", err)
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
      cancelled: "bg-gray-100 text-gray-800",
      disputed: "bg-red-100 text-red-800",
    }
    return styles[status] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center">
          <div className="animate-pulse text-gray-500">Loading orders...</div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <h2 className="text-xl font-semibold mb-6">My Service Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No service orders yet. Browse service products to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Order ID</div>
                  <div className="font-mono text-sm">{order.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Service Type</div>
                  <div>{order.service_product?.service_type || "N/A"}</div>
                </div>
              </div>
              {order.requirements && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-500">Requirements</div>
                  <div className="text-sm mt-1">{JSON.stringify(order.requirements)}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}