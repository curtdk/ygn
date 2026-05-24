"use client"

import { useState } from "react"
import { Container } from "@medusajs/ui"
import ServiceProductList from "../components/service-product-list"
import ServiceOrderList from "../components/service-order-list"
import ProviderOrderList from "../components/provider-order-list"

export default function ServiceTemplate() {
  const [activeTab, setActiveTab] = useState("products")

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Services</h1>
        <p className="text-gray-600">
          Browse and manage professional services
        </p>
      </div>
      
      <div className="flex gap-2 mb-8 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "products"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("products")}
        >
          Service Products
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "orders"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          My Orders
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "provider"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("provider")}
        >
          Provider Orders
        </button>
      </div>
      
      {activeTab === "products" && <ServiceProductList />}
      {activeTab === "orders" && <ServiceOrderList />}
      {activeTab === "provider" && <ProviderOrderList />}
    </Container>
  )
}