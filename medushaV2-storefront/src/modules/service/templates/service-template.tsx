"use client"

import { useState } from "react"
import { Container, clx } from "@medusajs/ui"
import ServiceProductList from "@modules/service/components/service-product-list"
import ServiceOrderList from "@modules/service/components/service-order-list"
import ProviderOrderList from "@modules/service/components/provider-order-list"
import ServiceReviewForm from "@modules/service/components/review"
import UploadResultForm from "@modules/service/components/upload-result"

type Tab = "products" | "my-orders" | "provider-orders"

export default function ServiceTemplate() {
  const [activeTab, setActiveTab] = useState<Tab>("products")
  const [viewMode, setViewMode] = useState<"list" | "detail">("list")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [actionMode, setActionMode] = useState<"review" | "upload" | null>(null)

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order)
    setViewMode("detail")
  }

  const handleBack = () => {
    setViewMode("list")
    setSelectedOrder(null)
    setActionMode(null)
  }

  const handleReviewClick = () => {
    setActionMode("review")
  }

  const handleUploadClick = () => {
    setActionMode("upload")
  }

  const handleActionComplete = () => {
    setActionMode(null)
    setViewMode("list")
    setSelectedOrder(null)
  }

  if (viewMode === "detail" && selectedOrder) {
    return (
      <Container className="py-8">
        <button
          onClick={handleBack}
          className="mb-6 text-sm text-gray-500 hover:text-gray-700"
        >
          ← 返回列表
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">订单详情</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">订单ID</span>
                <span className="font-mono text-sm">{selectedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">状态</span>
                <span className={clx(
                  "px-2 py-1 rounded text-sm",
                  selectedOrder.status === "pending" && "bg-yellow-100 text-yellow-800",
                  selectedOrder.status === "accepted" && "bg-blue-100 text-blue-800",
                  selectedOrder.status === "completed" && "bg-green-100 text-green-800",
                  selectedOrder.status === "cancelled" && "bg-red-100 text-red-800"
                )}>
                  {selectedOrder.status === "pending" && "待接单"}
                  {selectedOrder.status === "accepted" && "已接单"}
                  {selectedOrder.status === "in_progress" && "服务中"}
                  {selectedOrder.status === "completed" && "已完成"}
                  {selectedOrder.status === "cancelled" && "已取消"}
                </span>
              </div>
              {selectedOrder.result_url && (
                <div>
                  <span className="text-gray-500 block mb-2">服务结果</span>
                  <img 
                    src={selectedOrder.result_url} 
                    alt="服务结果" 
                    className="w-full max-h-64 object-cover rounded"
                  />
                </div>
              )}
              {selectedOrder.rating && (
                <div className="flex justify-between">
                  <span className="text-gray-500">评分</span>
                  <span className="text-yellow-500">{"★".repeat(selectedOrder.rating)}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              {selectedOrder.status === "completed" && !selectedOrder.rating && (
                <button
                  onClick={handleReviewClick}
                  className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                >
                  评价服务
                </button>
              )}
              {selectedOrder.provider_id && selectedOrder.status === "pending" && (
                <button
                  onClick={handleUploadClick}
                  className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                  上传服务结果
                </button>
              )}
            </div>
          </div>

          {/* Review or Upload Form */}
          {actionMode === "review" && selectedOrder && (
            <ServiceReviewForm 
              orderId={selectedOrder.id} 
              onSubmit={handleActionComplete}
            />
          )}
          
          {actionMode === "upload" && selectedOrder && (
            <UploadResultForm
              orderId={selectedOrder.id}
              onSubmit={async (resultUrl, resultThumbnail) => {
                try {
                  const response = await fetch(`/store/service-orders/${selectedOrder.id}`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                    },
                    body: JSON.stringify({
                      action: "complete",
                      result_url: resultUrl,
                      result_thumbnail: resultThumbnail,
                    }),
                  })
                  if (response.ok) {
                    handleActionComplete()
                  }
                } catch (error) {
                  console.error("Failed to complete order:", error)
                }
              }}
              onCancel={handleBack}
            />
          )}
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">服务市场</h1>
        <p className="text-gray-600">
          浏览和购买专业服务产品
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab("products")}
          className={clx(
            "pb-4 px-2 font-medium transition-colors",
            activeTab === "products"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          服务产品
        </button>
        <button
          onClick={() => setActiveTab("my-orders")}
          className={clx(
            "pb-4 px-2 font-medium transition-colors",
            activeTab === "my-orders"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          我的订单
        </button>
        <button
          onClick={() => setActiveTab("provider-orders")}
          className={clx(
            "pb-4 px-2 font-medium transition-colors",
            activeTab === "provider-orders"
              ? "border-b-2 border-orange-500 text-orange-500"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          服务商订单
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "products" && <ServiceProductList />}
      {activeTab === "my-orders" && <ServiceOrderList onOrderClick={handleOrderClick} />}
      {activeTab === "provider-orders" && <ProviderOrderList onOrderClick={handleOrderClick} />}
    </Container>
  )
}