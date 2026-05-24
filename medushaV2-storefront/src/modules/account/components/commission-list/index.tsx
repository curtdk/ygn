"use client"

import { useEffect, useState } from "react"
import { getCommissions, getCommissionSummary } from "@lib/data/commission"
import { Container } from "@medusajs/ui"

export default function CommissionList() {
  const [commissions, setCommissions] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [commissionsRes, summaryRes] = await Promise.all([
        getCommissions(),
        getCommissionSummary(),
      ])
      setCommissions(commissionsRes.commissions || [])
      setSummary(summaryRes.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load commissions")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      settled: "bg-green-100 text-green-800",
      withdrawn: "bg-blue-100 text-blue-800",
      cancelled: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
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
        <h1 className="text-2xl font-bold mb-2">My Commissions</h1>
        <p className="text-gray-600">
          Track your referral commissions and earnings.
        </p>
      </div>
      
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">Total Referrals</div>
            <div className="text-2xl font-bold">{summary.total_referrals}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-sm text-gray-500">Pending Commission</div>
            <div className="text-2xl font-bold text-yellow-700">¥{summary.pending_commission?.toFixed(2)}</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-500">Settled Commission</div>
            <div className="text-2xl font-bold text-green-700">¥{summary.settled_commission?.toFixed(2)}</div>
          </div>
        </div>
      )}
      
      {commissions.length === 0 ? (
        <div className="text-center text-gray-500">
          No commissions yet. Start referring customers to earn commissions!
        </div>
      ) : (
        <div className="space-y-4">
          {commissions.map((commission) => (
            <div key={commission.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(commission.status)}`}>
                  {commission.status}
                </span>
                <span className="text-sm text-gray-500">
                  Level {commission.level}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Order Amount</div>
                  <div className="font-medium">¥{commission.order_amount?.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Commission</div>
                  <div className="font-medium text-green-600">+¥{commission.commission_amount?.toFixed(2)}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {new Date(commission.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}