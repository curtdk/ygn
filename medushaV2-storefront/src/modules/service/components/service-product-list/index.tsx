"use client"

import { useEffect, useState } from "react"
import { Container } from "@medusajs/ui"
import ServiceProductCard from "./service-product-card"

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

export default function ServiceProductList() {
  const [products, setProducts] = useState<ServiceProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:9000/store/service-products", {
        headers: {
          "x-publishable-api-key": "pk_27e90a2b8c5d4cb6b678b2be59be8e3c3065414263f702a6086f3c12d283de61",
        },
      })
      if (response.ok) {
        const result = await response.json()
        setProducts(result.service_products || [])
      }
    } catch (err) {
      console.error("Failed to load products:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center">
          <div className="animate-pulse text-gray-500">Loading services...</div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <h2 className="text-xl font-semibold mb-6">Available Services</h2>
      
      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No services available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ServiceProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </Container>
  )
}