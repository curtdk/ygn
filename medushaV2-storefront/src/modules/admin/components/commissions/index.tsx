"use client"

import { useEffect, useState } from "react"
import { Container, Table } from "@medusajs/ui"
import { Badge } from "@medusajs/ui"

interface Commission {
  id: string
  customer_id: string
  referrer_id: string
  order_id: string
  level: number
  commission_type: "order" | "service"
  order_amount: number
  commission_rate: number
  commission_amount: number
  status: "pending" | "settled" | "withdrawn" | "cancelled"
  created_at: string
}

export default function CommissionsAdmin() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    settled: 0,
    totalAmount: 0,
  })

  useEffect(() => {
    loadCommissions()
  }, [])

  const loadCommissions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/admin/commissions", {
        headers: {
          Authorization: `Bearer ${process.env.MEDUSA_ADMIN_TOKEN}`,
        },
      })
      const data = await response.json()
      const allCommissions = data.commissions || []
      setCommissions(allCommissions)
      setStats({
        total: allCommissions.length,
        pending: allCommissions.filter((c: Commission) => c.status === "pending").length,
        settled: allCommissions.filter((c: Commission) => c.status === "settled" || c.status === "withdrawn").length,
        totalAmount: allCommissions.reduce((sum: number, c: Commission) => sum + c.commission_amount, 0),
      })
    } catch (error) {
      console.error("Failed to load commissions:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "success" | "danger" | "warning"> = {
      pending: "warning",
      settled: "success",
      withdrawn: "success",
      cancelled: "danger",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center">
          <div className="animate-pulse text-gray-500">Loading commissions...</div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Commission Management</h1>
        <p className="text-gray-600">
          View and manage referral commissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Total Commissions</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-gray-500">Settled</div>
          <div className="text-2xl font-bold text-green-700">{stats.settled}</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-sm text-gray-500">Total Amount</div>
          <div className="text-2xl font-bold text-purple-700">¥{stats.totalAmount.toFixed(2)}</div>
        </div>
      </div>

      {commissions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No commissions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Order ID</Table.HeaderCell>
                <Table.HeaderCell>Referrer</Table.HeaderCell>
                <Table.HeaderCell>Level</Table.HeaderCell>
                <Table.HeaderCell>Order Amount</Table.HeaderCell>
                <Table.HeaderCell>Commission</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Created</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {commissions.map((commission) => (
                <Table.Row key={commission.id}>
                  <Table.Cell className="font-mono text-sm">{commission.order_id}</Table.Cell>
                  <Table.Cell className="font-mono text-sm">{commission.referrer_id}</Table.Cell>
                  <Table.Cell>Level {commission.level}</Table.Cell>
                  <Table.Cell>¥{commission.order_amount?.toFixed(2)}</Table.Cell>
                  <Table.Cell className="text-green-600">+¥{commission.commission_amount?.toFixed(2)}</Table.Cell>
                  <Table.Cell>{getStatusBadge(commission.status)}</Table.Cell>
                  <Table.Cell>
                    {new Date(commission.created_at).toLocaleDateString()}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </Container>
  )
}