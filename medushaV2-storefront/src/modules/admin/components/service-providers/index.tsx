"use client"

import { useEffect, useState } from "react"
import { Container, Table } from "@medusajs/ui"
import { Badge } from "@medusajs/ui"

interface Provider {
  id: string
  customer_id: string
  phone: string
  status: "pending" | "approved" | "rejected"
  approved_at?: string
  created_at: string
}

export default function ServiceProvidersList() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 })

  useEffect(() => {
    loadProviders()
  }, [])

  const loadProviders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/admin/service-providers", {
        headers: {
          Authorization: `Bearer ${process.env.MEDUSA_ADMIN_TOKEN}`,
        },
      })
      const data = await response.json()
      const allProviders = data.providers || []
      setProviders(allProviders)
      setStats({
        total: allProviders.length,
        approved: allProviders.filter((p: Provider) => p.status === "approved").length,
        pending: allProviders.filter((p: Provider) => p.status === "pending").length,
      })
    } catch (error) {
      console.error("Failed to load providers:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "success" | "danger" | "warning"> = {
      pending: "warning",
      approved: "success",
      rejected: "danger",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center">
          <div className="animate-pulse text-gray-500">Loading providers...</div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Service Providers</h1>
        <p className="text-gray-600">
          Manage all service providers in the system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500">Total Providers</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-gray-500">Approved</div>
          <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
        </div>
      </div>

      {providers.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No service providers found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ID</Table.HeaderCell>
                <Table.HeaderCell>Customer ID</Table.HeaderCell>
                <Table.HeaderCell>Phone</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Approved At</Table.HeaderCell>
                <Table.HeaderCell>Created At</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {providers.map((provider) => (
                <Table.Row key={provider.id}>
                  <Table.Cell className="font-mono text-sm">{provider.id}</Table.Cell>
                  <Table.Cell className="font-mono text-sm">{provider.customer_id}</Table.Cell>
                  <Table.Cell>{provider.phone}</Table.Cell>
                  <Table.Cell>{getStatusBadge(provider.status)}</Table.Cell>
                  <Table.Cell>
                    {provider.approved_at
                      ? new Date(provider.approved_at).toLocaleDateString()
                      : "-"}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(provider.created_at).toLocaleDateString()}
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