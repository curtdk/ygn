"use client"

import { useEffect, useState } from "react"
import { getEarnings, getEarningsSummary } from "@lib/data/commission"
import { Container } from "@medusajs/ui"

export default function EarningsList() {
  const [earnings, setEarnings] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [earningsRes, summaryRes] = await Promise.all([
        getEarnings(),
        getEarningsSummary(),
      ])
      setEarnings(earningsRes.earnings || [])
      setSummary(summaryRes.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load earnings")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      settled: "bg-green-100 text-green-800",
      withdrawn: "bg-blue-100 text-blue-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center">
          <div className="animate-pulse text-gray-500">Loading earnings...</div>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="text-center text-red-500">{error}</div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Earnings</h1>
        <p className="text-gray-600">
          Track your service provider earnings.
        </p>
      </div>
      
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="text-2xl font-bold">{summary.total_orders}</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-500">Total Amount</div>
            <div className="text-2xl font-bold text-purple-700">¥{summary.total_amount?.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-700">¥{summary.pending_amount?.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-500">Settled</div>
            <div className="text-2xl font-bold text-green-700">¥{summary.settled_amount?.toFixed(2)}</div>
          </div>
        </div>
      )}
      
      {earnings.length === 0 ? (
        <div className="text-center text-gray-500">
          No earnings yet. Complete service orders to earn money.
        </div>
      ) : (
        <div className="space-y-4">
          {earnings.map((earning) => (
            <div key={earning.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(earning.status)}`}>
                  {earning.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(earning.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Amount</div>
                  <div className="font-medium">¥{earning.amount?.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Platform Fee</div>
                  <div className="font-medium text-red-600">-¥{earning.platform_fee?.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Net Amount</div>
                  <div className="font-medium text-green-600">¥{earning.net_amount?.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}