"use client"

import { useEffect, useState } from "react"
import { Container, Table } from "@medusajs/ui"
import { Button, Badge } from "@medusajs/ui"

interface Application {
  id: string
  customer_id: string
  phone: string
  status: "pending" | "approved" | "rejected"
  rejection_reason?: string
  reviewed_at?: string
  created_at: string
}

export default function ServiceProviderApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const response = await fetch("/admin/service-applications", {
        headers: {
          Authorization: `Bearer ${process.env.MEDUSA_ADMIN_TOKEN}`,
        },
      })
      const data = await response.json()
      setApplications(data.applications || [])
    } catch (error) {
      console.error("Failed to load applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id)
      await fetch(`/admin/service-applications/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MEDUSA_ADMIN_TOKEN}`,
        },
        body: JSON.stringify({ action: "approve" }),
      })
      loadApplications()
    } catch (error) {
      console.error("Failed to approve:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (id: string, reason: string) => {
    try {
      setActionLoading(id)
      await fetch(`/admin/service-applications/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MEDUSA_ADMIN_TOKEN}`,
        },
        body: JSON.stringify({ action: "reject", rejection_reason: reason }),
      })
      loadApplications()
    } catch (error) {
      console.error("Failed to reject:", error)
    } finally {
      setActionLoading(null)
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
          <div className="animate-pulse text-gray-500">Loading applications...</div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Service Provider Applications</h1>
        <p className="text-gray-600">
          Review and manage service provider applications.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No pending applications.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Customer ID</Table.HeaderCell>
                <Table.HeaderCell>Phone</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Applied At</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {applications.map((app) => (
                <Table.Row key={app.id}>
                  <Table.Cell className="font-mono text-sm">{app.customer_id}</Table.Cell>
                  <Table.Cell>{app.phone}</Table.Cell>
                  <Table.Cell>{getStatusBadge(app.status)}</Table.Cell>
                  <Table.Cell>{new Date(app.created_at).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    {app.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="small"
                          variant="primary"
                          onClick={() => handleApprove(app.id)}
                          disabled={actionLoading === app.id}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="secondary"
                          onClick={() => {
                            const reason = prompt("Rejection reason:")
                            if (reason) handleReject(app.id, reason)
                          }}
                          disabled={actionLoading === app.id}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
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