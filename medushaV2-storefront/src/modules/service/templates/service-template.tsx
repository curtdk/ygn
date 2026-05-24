"use client"

import { useState } from "react"
import { Container, clx } from "@medusajs/ui"
import ServiceProductList from "@modules/service/components/service-product-list"
import ServiceOrderList from "@modules/service/components/service-order-list"
import ProviderOrderList from "@modules/service/components/provider-order-list"
import ServiceReviewForm from "@modules/service/components/review"
import UploadResultForm from "@modules/service/components/upload-result"

type Tab = "products" | "my-orders" | "provider-orders"

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

async function apiPost(path: string, body: Record<string, any>) {
  return fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }).then((r) => r.json())
}

export default function ServiceTemplate() {
  const [activeTab, setActiveTab] = useState<Tab>("products")
  const [viewMode, setViewMode] = useState<"list" | "detail">("list")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [actionMode, setActionMode] = useState<"review" | "upload" | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const refresh = () => {
    setRefreshKey((k) => k + 1)
    setViewMode("list")
    setSelectedOrder(null)
    setActionMode(null)
  }

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order)
    setViewMode("detail")
  }

  const handleBack = () => {
    setViewMode("list")
    setSelectedOrder(null)
    setActionMode(null)
  }

  const handleGrabOrder = async (order: any) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/store/service-orders/${order.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "accept" }),
      })
      if (res.ok) {
        refresh()
      } else {
        const err = await res.json()
        alert(err.message || "抢单失败，请重试")
      }
    } catch {
      alert("网络错误，请重试")
    } finally {
      setActionLoading(false)
    }
  }

  const handleStartService = async (orderId: string) => {
    setActionLoading(true)
    try {
      await fetch(`/store/service-orders/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "start" }),
      })
      refresh()
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmComplete = async (orderId: string) => {
    setActionLoading(true)
    try {
      await fetch(`/store/service-orders/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "complete" }),
      })
      refresh()
    } finally {
      setActionLoading(false)
    }
  }

  if (viewMode === "detail" && selectedOrder) {
    const order = selectedOrder
    const isProvider = activeTab === "provider-orders"

    return (
      <Container className="py-8">
        <button
          onClick={handleBack}
          className="mb-6 text-sm text-gray-500 hover:text-gray-700"
        >
          ← 返回列表
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 订单详情 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">订单详情</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">订单ID</span>
                <span className="font-mono text-sm">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">状态</span>
                <span className={clx("px-2 py-1 rounded text-sm", STATUS_CLASS[order.status])}>
                  {STATUS_TEXT[order.status] || order.status}
                </span>
              </div>
              {order.service_address && (
                <div className="flex justify-between">
                  <span className="text-gray-500">服务地址</span>
                  <span className="text-sm text-right max-w-48">{order.service_address}</span>
                </div>
              )}
              {order.service_date && (
                <div className="flex justify-between">
                  <span className="text-gray-500">预约日期</span>
                  <span className="text-sm">{order.service_date}</span>
                </div>
              )}
              {order.notes && (
                <div>
                  <span className="text-gray-500 block mb-1">备注</span>
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </div>
              )}
              {order.result_url && (
                <div>
                  <span className="text-gray-500 block mb-2">服务凭证</span>
                  <img
                    src={order.result_url}
                    alt="服务凭证"
                    className="w-full max-h-64 object-cover rounded"
                  />
                </div>
              )}
              {order.rating && (
                <div className="flex justify-between">
                  <span className="text-gray-500">评分</span>
                  <span className="text-yellow-500">{"★".repeat(order.rating)}{"☆".repeat(5 - order.rating)}</span>
                </div>
              )}
              {order.review_comment && (
                <div>
                  <span className="text-gray-500 block mb-1">评价内容</span>
                  <p className="text-sm text-gray-700">{order.review_comment}</p>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="mt-6 space-y-3">
              {/* 服务商操作 */}
              {isProvider && order.status === "pending" && !order.provider_id && (
                <button
                  onClick={() => handleGrabOrder(order)}
                  disabled={actionLoading}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {actionLoading ? "处理中..." : "立即抢单"}
                </button>
              )}
              {isProvider && order.status === "accepted" && (
                <button
                  onClick={() => setActionMode("upload")}
                  className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                >
                  上传到场凭证 / 开始服务
                </button>
              )}
              {isProvider && order.status === "in_progress" && (
                <button
                  onClick={() => setActionMode("upload")}
                  className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                  提交服务结果
                </button>
              )}

              {/* 消费者操作 */}
              {!isProvider && order.status === "in_progress" && (
                <button
                  onClick={() => handleConfirmComplete(order.id)}
                  disabled={actionLoading}
                  className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {actionLoading ? "处理中..." : "确认完成"}
                </button>
              )}
              {!isProvider && order.status === "completed" && !order.rating && (
                <button
                  onClick={() => setActionMode("review")}
                  className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                >
                  评价服务
                </button>
              )}
            </div>
          </div>

          {/* 评价 / 上传表单 */}
          {actionMode === "review" && (
            <ServiceReviewForm
              orderId={order.id}
              onSubmit={refresh}
            />
          )}

          {actionMode === "upload" && (
            <UploadResultForm
              orderId={order.id}
              onSubmit={async (resultUrl, resultThumbnail) => {
                try {
                  const action = order.status === "accepted" ? "start" : "complete"
                  await fetch(`/store/service-orders/${order.id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                      action,
                      result_url: resultUrl,
                      result_thumbnail: resultThumbnail,
                    }),
                  })
                  refresh()
                } catch {
                  alert("操作失败，请重试")
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
        <p className="text-gray-600">浏览和购买专业上门服务</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        {(["products", "my-orders", "provider-orders"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setViewMode("list")
              setSelectedOrder(null)
            }}
            className={clx(
              "pb-4 px-2 font-medium transition-colors",
              activeTab === tab
                ? "border-b-2 border-orange-500 text-orange-500"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {tab === "products" && "服务产品"}
            {tab === "my-orders" && "我的订单"}
            {tab === "provider-orders" && "服务商接单"}
          </button>
        ))}
      </div>

      {activeTab === "products" && <ServiceProductList />}
      {activeTab === "my-orders" && <ServiceOrderList key={refreshKey} onOrderClick={handleOrderClick} />}
      {activeTab === "provider-orders" && (
        <ProviderOrderList
          key={refreshKey}
          onOrderClick={handleOrderClick}
          onGrabOrder={handleGrabOrder}
        />
      )}
    </Container>
  )
}
