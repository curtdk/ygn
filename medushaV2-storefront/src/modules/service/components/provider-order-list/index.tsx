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
  customer: any
  service_product: any
}

export default function ProviderOrderList() {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/store/service-orders/provider", {
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

  const handleOrderAction = async (orderId: string, action: string) => {
    try {
      await fetch(`/store/service-orders/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`,
        },
        body: JSON.stringify({ action }),
      })
      loadOrders()
    } catch (err) {
      console.error("Failed to process order:", err)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-gray-100 text-gray-800",
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
      <h2 className="text-xl font-semibold mb-6">Provider Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No orders found.
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
                  <div className="text-sm text-gray-500">Customer</div>
                  <div>{order.customer?.email || "N/A"}</div>
                </div>
              </div>
              {order.status === "pending" && (
                <div className="mt-4">
                  <Button 
                    size="small" 
                    onClick={() => handleOrderAction(order.id, "accept")}
                  >
                    Accept Order
                  </Button>
                </div>
              )}
              {order.status === "accepted" && (
                <div className="mt-4">
                  <Button 
                    size="small" 
                    onClick={() => handleOrderAction(order.id, "start")}
                  >
                    Start Processing
                  </Button>
                </div>
              )}
              {order.status === "in_progress" && (
                <div className="mt-4">
                  <Button 
                    size="small" 
                    onClick={() => handleOrderAction(order.id, "complete")}
                  >
                    Mark Complete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}