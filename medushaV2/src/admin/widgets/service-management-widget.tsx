import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Badge, Table, Button } from "@medusajs/ui"
import { useEffect, useState } from "react"

interface Application {
  id: string
  customer_id: string
  phone: string
  status: string
  created_at: string
}

interface ServiceOrder {
  id: string
  customer_id: string
  provider_id: string | null
  service_product_id: string
  status: string
  created_at: string
  service_address?: string
  service_date?: string
}

interface Settings {
  order_review_mode: string
  order_dispatch_mode: string
  commission_settlement_mode: string
  auto_complete_hours: number
  profit_sharing_level1_enabled: boolean
  profit_sharing_level2_enabled: boolean
  profit_sharing_level3_enabled: boolean
  default_commission_rate: number
  platform_fee_rate: number
}

type Tab = "applications" | "orders" | "settings"

const STATUS_TEXT: Record<string, string> = {
  pending: "待处理",
  approved: "已通过",
  rejected: "已拒绝",
  accepted: "已接单",
  in_progress: "服务中",
  completed: "已完成",
  cancelled: "已取消",
  disputed: "有争议",
}

const ServiceManagementWidget = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>("applications")
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [localSettings, setLocalSettings] = useState<Settings | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [appsRes, ordersRes, settingsRes] = await Promise.all([
        fetch("/admin/service-applications", { credentials: "include" }),
        fetch("/admin/service-orders?limit=50", { credentials: "include" }),
        fetch("/admin/service-settings", { credentials: "include" }),
      ])

      if (appsRes.ok) {
        const d = await appsRes.json()
        setApplications(d.applications || [])
      }
      if (ordersRes.ok) {
        const d = await ordersRes.json()
        setOrders(d.orders || [])
      }
      if (settingsRes.ok) {
        const d = await settingsRes.json()
        setSettings(d.settings)
        setLocalSettings(d.settings)
      }
    } catch (e) {
      console.error("Failed to load service management data:", e)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveApp = async (id: string) => {
    await fetch(`/admin/service-applications/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "approve" }),
    })
    loadData()
  }

  const handleRejectApp = async (id: string) => {
    await fetch(`/admin/service-applications/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "reject" }),
    })
    loadData()
  }

  const handleOrderAction = async (orderId: string, action: string, extra?: Record<string, any>) => {
    await fetch(`/admin/service-orders/${orderId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action, ...extra }),
    })
    loadData()
  }

  const handleSaveSettings = async () => {
    if (!localSettings) return
    setSettingsSaving(true)
    try {
      await fetch("/admin/service-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ updates: localSettings }),
      })
      await loadData()
    } finally {
      setSettingsSaving(false)
    }
  }

  const pendingApps = applications.filter(a => a.status === "pending")

  if (loading) {
    return (
      <Container>
        <div className="p-4 text-gray-500">加载服务管理数据中...</div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-4">
        <Heading level="h2">服务管理中心</Heading>
        <Button size="small" variant="secondary" onClick={loadData}>刷新</Button>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {(["applications", "orders", "settings"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "applications" && `资质审核 ${pendingApps.length > 0 ? `(${pendingApps.length}待审)` : ""}`}
            {tab === "orders" && `服务订单 (${orders.length})`}
            {tab === "settings" && "全局配置"}
          </button>
        ))}
      </div>

      {/* 资质审核 Tab */}
      {activeTab === "applications" && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>客户ID</Table.HeaderCell>
              <Table.HeaderCell>联系电话</Table.HeaderCell>
              <Table.HeaderCell>状态</Table.HeaderCell>
              <Table.HeaderCell>申请时间</Table.HeaderCell>
              <Table.HeaderCell>操作</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {applications.length === 0 ? (
              <Table.Row>
                <td colSpan={6} className="text-center py-8 text-gray-400">暂无申请记录</td>
              </Table.Row>
            ) : applications.map((app) => (
              <Table.Row key={app.id}>
                <Table.Cell className="font-mono text-xs">{app.id.slice(0, 8)}...</Table.Cell>
                <Table.Cell className="font-mono text-xs">{app.customer_id.slice(0, 8)}...</Table.Cell>
                <Table.Cell>{app.phone}</Table.Cell>
                <Table.Cell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    app.status === "approved" ? "bg-green-100 text-green-700" :
                    app.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {STATUS_TEXT[app.status] || app.status}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-xs">{new Date(app.created_at).toLocaleDateString("zh-CN")}</Table.Cell>
                <Table.Cell>
                  {app.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="small" variant="primary" onClick={() => handleApproveApp(app.id)}>通过</Button>
                      <Button size="small" variant="secondary" onClick={() => handleRejectApp(app.id)}>拒绝</Button>
                    </div>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* 服务订单 Tab */}
      {activeTab === "orders" && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>订单ID</Table.HeaderCell>
              <Table.HeaderCell>客户ID</Table.HeaderCell>
              <Table.HeaderCell>服务商ID</Table.HeaderCell>
              <Table.HeaderCell>服务地址</Table.HeaderCell>
              <Table.HeaderCell>状态</Table.HeaderCell>
              <Table.HeaderCell>创建时间</Table.HeaderCell>
              <Table.HeaderCell>操作</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orders.length === 0 ? (
              <Table.Row>
                <td colSpan={7} className="text-center py-8 text-gray-400">暂无订单记录</td>
              </Table.Row>
            ) : orders.map((order) => (
              <Table.Row key={order.id}>
                <Table.Cell className="font-mono text-xs">{order.id.slice(0, 8)}...</Table.Cell>
                <Table.Cell className="font-mono text-xs">{order.customer_id.slice(0, 8)}...</Table.Cell>
                <Table.Cell className="font-mono text-xs">{order.provider_id ? order.provider_id.slice(0, 8) + "..." : "—"}</Table.Cell>
                <Table.Cell className="text-xs max-w-32 truncate">{order.service_address || "—"}</Table.Cell>
                <Table.Cell>
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === "completed" ? "bg-green-100 text-green-700" :
                    order.status === "cancelled" ? "bg-red-100 text-red-700" :
                    order.status === "in_progress" ? "bg-purple-100 text-purple-700" :
                    order.status === "accepted" ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {STATUS_TEXT[order.status] || order.status}
                  </span>
                </Table.Cell>
                <Table.Cell className="text-xs">{new Date(order.created_at).toLocaleDateString("zh-CN")}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-1 flex-wrap">
                    {order.status === "pending" && (
                      <Button size="small" variant="primary" onClick={() => handleOrderAction(order.id, "approve")}>
                        审核通过
                      </Button>
                    )}
                    {order.status === "pending" && !order.provider_id && (
                      <Button size="small" variant="secondary" onClick={() => {
                        const pid = prompt("输入服务商ID进行指派：")
                        if (pid) handleOrderAction(order.id, "assign", { provider_id: pid })
                      }}>
                        指派
                      </Button>
                    )}
                    {(order.status === "pending" || order.status === "accepted") && (
                      <Button size="small" variant="secondary" onClick={() => handleOrderAction(order.id, "cancel")}>
                        取消
                      </Button>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* 全局配置 Tab */}
      {activeTab === "settings" && localSettings && (
        <div className="space-y-6 max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">订单审核模式</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={localSettings.order_review_mode}
                onChange={(e) => setLocalSettings({ ...localSettings, order_review_mode: e.target.value })}
              >
                <option value="auto">自动审核</option>
                <option value="manual">人工审核</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">派单模式</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={localSettings.order_dispatch_mode}
                onChange={(e) => setLocalSettings({ ...localSettings, order_dispatch_mode: e.target.value })}
              >
                <option value="grab">抢单模式</option>
                <option value="assigned">人工指派</option>
                <option value="auto">自动派单</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">佣金结算模式</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={localSettings.commission_settlement_mode}
                onChange={(e) => setLocalSettings({ ...localSettings, commission_settlement_mode: e.target.value })}
              >
                <option value="auto">自动结算</option>
                <option value="manual">手动审核结算</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">自动完结时长（小时）</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={localSettings.auto_complete_hours}
                onChange={(e) => setLocalSettings({ ...localSettings, auto_complete_hours: parseInt(e.target.value) || 72 })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">默认佣金比例（%）</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={Math.round(Number(localSettings.default_commission_rate) * 100)}
                onChange={(e) => setLocalSettings({ ...localSettings, default_commission_rate: parseFloat(e.target.value) / 100 })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">平台手续费（%）</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                value={Math.round(Number(localSettings.platform_fee_rate) * 100)}
                onChange={(e) => setLocalSettings({ ...localSettings, platform_fee_rate: parseFloat(e.target.value) / 100 })}
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">三级分润开关</p>
            <div className="flex gap-4">
              {([1, 2, 3] as const).map((level) => {
                const key = `profit_sharing_level${level}_enabled` as keyof Settings
                return (
                  <label key={level} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!localSettings[key]}
                      onChange={(e) => setLocalSettings({ ...localSettings, [key]: e.target.checked })}
                    />
                    第{level}级分润
                  </label>
                )
              })}
            </div>
          </div>

          <Button onClick={handleSaveSettings} disabled={settingsSaving}>
            {settingsSaving ? "保存中..." : "保存配置"}
          </Button>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.list.after",
})

export default ServiceManagementWidget
