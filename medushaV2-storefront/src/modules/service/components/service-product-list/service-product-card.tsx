"use client"

import { useState } from "react"
import { Container, Button } from "@medusajs/ui"

interface ServiceProduct {
  id: string
  product_id: string
  service_type: string
  description: string
  estimated_duration: number
  requirements: any
  is_active: boolean
  product: any
}

interface Props {
  product: ServiceProduct
}

export default function ServiceProductCard({ product }: Props) {
  const [loading, setLoading] = useState(false)

  const handleOrder = async () => {
    setLoading(true)
    try {
      await fetch("/api/service-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_product_id: product.id,
          requirements: {},
        }),
      })
    } catch (err) {
      console.error("Failed to create order:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-medium">{product.service_type}</h3>
          <p className="text-sm text-gray-500">{product.product?.title || "Service"}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded ${
          product.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}>
          {product.is_active ? "Active" : "Inactive"}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{product.description}</p>
      
      {product.estimated_duration && (
        <div className="text-sm text-gray-500 mb-3">
          Estimated: {product.estimated_duration} minutes
        </div>
      )}
      
      <Button 
        size="small" 
        onClick={handleOrder}
        disabled={loading || !product.is_active}
        className="w-full"
      >
        {loading ? "Processing..." : "Order Service"}
      </Button>
    </div>
  )
}