import { MedusaService } from "@medusajs/framework/utils"
import Commission from "./models/commission"
import CommissionSettlement from "./models/commission-settlement"
import ProviderEarnings from "./models/provider-earnings"

// Default commission rates by level
const DEFAULT_COMMISSION_RATES = {
  1: 0.10, // 10% for first level
  2: 0.05, // 5% for second level
  3: 0.02, // 2% for third level
}

class CommissionModuleService extends MedusaService({
  Commission,
  CommissionSettlement,
  ProviderEarnings,
}) {
  async calculateCommission(orderAmount: number, level: number): number {
    const rate = DEFAULT_COMMISSION_RATES[level as keyof typeof DEFAULT_COMMISSION_RATES] || 0.02
    return orderAmount * rate
  }

  async createCommission(data: {
    customer_id: string
    referrer_id: string
    order_id: string
    level: number
    commission_type?: "order" | "service"
    order_amount: number
    service_order_id?: string
  }) {
    const commission_rate = DEFAULT_COMMISSION_RATES[data.level as keyof typeof DEFAULT_COMMISSION_RATES] || 0.02
    const commission_amount = this.calculateCommission(data.order_amount, data.level)

    return await this.createCommissions({
      ...data,
      commission_type: data.commission_type || "order",
      commission_rate,
      commission_amount,
      status: "pending",
    })
  }

  async settleCommission(commissionId: string, settledBy: string) {
    return await this.updateCommissions(commissionId, {
      status: "settled",
      settled_at: new Date(),
      settled_by: settledBy,
    })
  }

  async createProviderEarning(data: {
    provider_id: string
    service_order_id: string
    order_id?: string
    amount: number
    platform_fee?: number
  }) {
    const netAmount = data.amount - (data.platform_fee || 0)

    return await this.createProviderEarnings({
      ...data,
      platform_fee: data.platform_fee || 0,
      net_amount: netAmount,
      status: "pending",
    })
  }

  async settleProviderEarnings(providerId: string) {
    const pendingEarnings = await this.listProviderEarnings({
      provider_id: providerId,
      status: "pending",
    })

    // Settle all pending earnings
    for (const earning of pendingEarnings) {
      await this.updateProviderEarnings(earning.id, {
        status: "settled",
        settled_at: new Date(),
      })
    }

    return pendingEarnings
  }

  async getProviderEarningsSummary(providerId: string) {
    const [allEarnings, pendingEarnings, settledEarnings] = await Promise.all([
      this.listProviderEarnings({ provider_id: providerId }),
      this.listProviderEarnings({ provider_id: providerId, status: "pending" }),
      this.listProviderEarnings({ provider_id: providerId, status: "settled" }),
    ])

    const totalAmount = allEarnings.reduce((sum, e) => sum + Number(e.amount), 0)
    const totalNetAmount = allEarnings.reduce((sum, e) => sum + Number(e.net_amount), 0)
    const pendingAmount = pendingEarnings.reduce((sum, e) => sum + Number(e.net_amount), 0)
    const settledAmount = settledEarnings.reduce((sum, e) => sum + Number(e.net_amount), 0)

    return {
      total_orders: allEarnings.length,
      total_amount: totalAmount,
      total_net_amount: totalNetAmount,
      pending_amount: pendingAmount,
      settled_amount: settledAmount,
    }
  }

  async getReferrerCommissions(referrerId: string) {
    return await this.listCommissions({
      referrer_id: referrerId,
    }, {
      order: { created_at: "DESC" },
    })
  }

  async getReferrerCommissionSummary(referrerId: string) {
    const commissions = await this.listCommissions({
      referrer_id: referrerId,
    })

    const totalPending = commissions
      .filter(c => c.status === "pending")
      .reduce((sum, c) => sum + Number(c.commission_amount), 0)

    const totalSettled = commissions
      .filter(c => c.status === "settled" || c.status === "withdrawn")
      .reduce((sum, c) => sum + Number(c.commission_amount), 0)

    return {
      total_referrals: commissions.length,
      pending_commission: totalPending,
      settled_commission: totalSettled,
    }
  }

  async createSettlement(data: {
    referrer_id: string
    total_amount: number
    service_charge?: number
    payment_method?: "alipay" | "bank" | "wechat"
    payment_account?: string
    notes?: string
  }) {
    const actualAmount = data.total_amount - (data.service_charge || 0)

    return await this.createCommissionSettlements({
      ...data,
      service_charge: data.service_charge || 0,
      actual_amount: actualAmount,
      status: "pending",
    })
  }

  async processSettlement(settlementId: string, processedBy: string, paymentProof?: string) {
    return await this.updateCommissionSettlements(settlementId, {
      status: "processing",
      processed_at: new Date(),
      processed_by: processedBy,
      payment_proof: paymentProof || null,
    })
  }

  async completeSettlement(settlementId: string) {
    return await this.updateCommissionSettlements(settlementId, {
      status: "completed",
    })
  }

  async getReferralTree(customerId: string) {
    const referrals = await this.listCommissions({
      referrer_id: customerId,
    })

    // Group by level
    const level1 = referrals.filter(r => r.level === 1)
    const level2 = referrals.filter(r => r.level === 2)
    const level3 = referrals.filter(r => r.level === 3)

    return {
      level1_count: level1.length,
      level2_count: level2.length,
      level3_count: level3.length,
      level1_referrals: level1,
      level2_referrals: level2,
      level3_referrals: level3,
    }
  }
}

export default CommissionModuleService