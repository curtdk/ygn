import { defineWidgetConfig } from "@medusajs/framework/ui-sdk"
import { Label, Badge, Table, Button } from "@medusajs/ui"
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
  provider_id: string
  status: string
  created_at: string
}

export const ServiceManagementWidget = defineWidgetConfig({
  zone: "service.list.after",
  headless: false,
}, () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"applications" | "orders">("applications")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load applications
      const appsRes = await fetch("/admin/service-applications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      })
      if (appsRes.ok) {
        const appsData = await appsRes.json()
        setApplications(appsData.applications || [])
      }

      // Load orders
      const ordersRes = await fetch("/admin/service-orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      })
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData.orders || [])
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/admin/service-applications/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ action: "approve" }),
      })
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error("Failed to approve:", error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/admin/service-applications/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ action: "reject" }),
      })
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error("Failed to reject:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return styles[status] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return <div className="p-4">加载中...</div>
  }

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === "applications"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setActiveTab("applications")}
        >
          服务商申请 ({applications.length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeTab === "orders"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          服务订单 ({orders.length})
        </button>
      </div>

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
                <Table.Cell colSpan={6} className="text-center py-8 text-gray-500">
                  暂无申请记录
                </Table.Cell>
              </Table.Row>
            ) : (
              applications.map((app) => (
                <Table.Row key={app.id}>
                  <Table.Cell className="font-mono text-sm">{app.id.slice(0, 8)}...</Table.Cell>
                  <Table.Cell className="font-mono text-sm">{app.customer_id.slice(0, 8)}...</Table.Cell>
                  <Table.Cell>{app.phone}</Table.Cell>
                  <Table.Cell>
                    <Badge className={getStatusBadge(app.status)}>
                      {app.status === "pending" ? "待审核" : app.status === "approved" ? "已通过" : "已拒绝"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{new Date(app.created_at).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="small"
                          variant="primary"
                          onClick={() => handleApprove(app.id)}
                        >
                          通过
                        </Button>
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => handleReject(app.id)}
                        >
                          拒绝
                        </Button>
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      )}

      {activeTab === "orders" && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>客户ID</Table.HeaderCell>
              <Table.HeaderCell>服务商ID</Table.HeaderCell>
              <Table.HeaderCell>状态</Table.HeaderCell>
              <Table.HeaderCell>创建时间</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orders.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center py-8 text-gray-500">
                  暂无订单记录
                </Table.Cell>
              </Table.Row>
            ) : (
              orders.map((order) => (
                <Table.Row key={order.id}>
                  <Table.Cell className="font-mono text-sm">{order.id.slice(0, 8)}...</Table.Cell>
                  <Table.Cell className="font-mono text-sm">{order.customer_id.slice(0, 8)}...</Table.Cell>
                  <Table.Cell className="font-mono text-sm">{order.provider_id?.slice(0, 8) || "-"}...</Table.Cell>
                  <Table.Cell>
                    <Badge className={getStatusBadge(order.status)}>
                      {order.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{new Date(order.created_at).toLocaleDateString()}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      )}
    </div>
  )
})