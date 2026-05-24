"use client"

import { useEffect, useState } from "react"
import { Container, Button, Badge, clx } from "@medusajs/ui"

interface OrderModeSettings {
  mode: "grab" | "assigned"
  enabled: boolean
  auto_assign: boolean
  description?: string
}

export default function OrderModeSettings() {
  const [settings, setSettings] = useState<OrderModeSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/store/order-mode")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (err) {
      setError("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const updateMode = async (mode: "grab" | "assigned") => {
    setUpdating(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch("/admin/order-mode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ mode }),
      })
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
        setSuccess(`模式已更新为：${mode === "grab" ? "抢单模式" : "派单模式"}`)
      } else {
        throw new Error("更新失败")
      }
    } catch (err) {
      setError("更新设置失败")
    } finally {
      setUpdating(false)
    }
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

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">接单模式设置</h1>
        <p className="text-gray-600">
          选择服务订单的分配方式
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 border border-green-200 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {settings && (
        <div className="space-y-6">
          {/* Current Mode Display */}
          <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">当前模式</div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">
                    {settings.mode === "grab" ? "抢单模式" : "派单模式"}
                  </h2>
                  <Badge
                    className={clx(
                      settings.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    )}
                  >
                    {settings.enabled ? "已启用" : "已禁用"}
                  </Badge>
                </div>
                <p className="text-gray-600 mt-2">
                  {settings.mode === "grab"
                    ? "服务商可以自由抢接订单，先到先得"
                    : "订单由平台根据规则统一分配给服务商"}
                </p>
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div>
            <h3 className="font-medium mb-4">选择接单模式</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Grab Mode */}
              <button
                onClick={() => updateMode("grab")}
                disabled={updating || settings.mode === "grab"}
                className={clx(
                  "p-6 rounded-lg border-2 text-left transition-all",
                  settings.mode === "grab"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 hover:border-gray-300",
                  updating && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={clx(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                    settings.mode === "grab" ? "bg-orange-500" : "bg-gray-400"
                  )}>
                    抢
                  </div>
                  <div>
                    <h4 className="font-semibold">抢单模式</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      服务商可以自由抢接订单，公平竞争，提高效率
                    </p>
                    <ul className="text-sm text-gray-500 mt-2 space-y-1">
                      <li>✓ 先到先得</li>
                      <li>✓ 服务商自主选择</li>
                      <li>✓ 激励竞争</li>
                    </ul>
                  </div>
                </div>
                {settings.mode === "grab" && (
                  <Badge className="mt-4 bg-orange-500 text-white">当前模式</Badge>
                )}
              </button>

              {/* Assigned Mode */}
              <button
                onClick={() => updateMode("assigned")}
                disabled={updating || settings.mode === "assigned"}
                className={clx(
                  "p-6 rounded-lg border-2 text-left transition-all",
                  settings.mode === "assigned"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300",
                  updating && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={clx(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                    settings.mode === "assigned" ? "bg-blue-500" : "bg-gray-400"
                  )}>
                    派
                  </div>
                  <div>
                    <h4 className="font-semibold">派单模式</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      订单由平台根据服务商评分、距离等因素智能分配
                    </p>
                    <ul className="text-sm text-gray-500 mt-2 space-y-1">
                      <li>✓ 平台智能分配</li>
                      <li>✓ 优化匹配度</li>
                      <li>✓ 质量保障</li>
                    </ul>
                  </div>
                </div>
                {settings.mode === "assigned" && (
                  <Badge className="mt-4 bg-blue-500 text-white">当前模式</Badge>
                )}
              </button>
            </div>
          </div>

          {/* Additional Options */}
          {settings.mode === "assigned" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">派单规则</h4>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto_assign"
                  checked={settings.auto_assign}
                  onChange={async (e) => {
                    const response = await fetch("/admin/order-mode", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                      },
                      body: JSON.stringify({ auto_assign: e.target.checked }),
                    })
                    if (response.ok) {
                      loadSettings()
                    }
                  }}
                  className="rounded"
                />
                <label htmlFor="auto_assign" className="text-sm text-gray-600">
                  启用自动派单（新订单自动分配给最优服务商）
                </label>
              </div>
            </div>
          )}
        </div>
      )}
    </Container>
  )
}