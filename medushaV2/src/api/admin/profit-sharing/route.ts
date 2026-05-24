import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PROVIDER_MODULE } from "../../../modules/service-provider"
import { COMMISSION_MODULE } from "../../../modules/commission"
import { SERVICE_PRODUCT_MODULE } from "../../../modules/service-product"
import CommissionModuleService from "../../../modules/commission/service"
import ServiceProviderModuleService from "../../../modules/service-provider/service"
import ServiceProductModuleService from "../../../modules/service-product/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const commissionService = req.scope.resolve<CommissionModuleService>(COMMISSION_MODULE)
  const { limit = 50, offset = 0, referrer_id, customer_id, status } = req.query

  const filters: Record<string, any> = {
    commission_type: "service",
  }
  if (referrer_id) filters.referrer_id = referrer_id
  if (customer_id) filters.customer_id = customer_id
  if (status) filters.status = status

  const [records, count] = await (commissionService as any).listAndCountCommissions(filters, {
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    order: { created_at: "DESC" },
  })

  res.json({
    records,
    count,
    offset: parseInt(offset as string),
    limit: parseInt(limit as string),
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = req.body as any
  const serviceProviderService = req.scope.resolve<ServiceProviderModuleService>(SERVICE_PROVIDER_MODULE)
  const serviceProductService = req.scope.resolve<ServiceProductModuleService>(SERVICE_PRODUCT_MODULE)
  const commissionService = req.scope.resolve<CommissionModuleService>(COMMISSION_MODULE)

  try {
    const order = await serviceProductService.retrieveServiceOrder(body.order_id)
    const customerId = order.customer_id
    const orderAmount = body.order_amount || 0

    const referrals = await serviceProviderService.listCustomerReferrals({
      referee_id: customerId,
    })

    if (referrals.length === 0) {
      return res.json({
        message: "No referral chain found, no profit sharing applied",
        records: [],
      })
    }

    referrals.sort((a: any, b: any) => (a.level || 1) - (b.level || 1))

    const defaultRates: Record<number, number> = { 1: 0.10, 2: 0.05, 3: 0.02 }
    const createdRecords: any[] = []

    for (const referral of referrals.slice(0, 3)) {
      const level = referral.level || 1
      const rate = body[`profit_sharing_level${level}`] ?? defaultRates[level] ?? 0.02
      const commissionAmount = orderAmount * rate

      if (commissionAmount <= 0) continue

      const record = await (commissionService as any).createCommissions({
        customer_id: customerId,
        referrer_id: referral.referrer_id,
        order_id: body.order_id,
        level,
        commission_type: "service",
        order_amount: orderAmount,
        commission_rate: rate,
        commission_amount: commissionAmount,
        status: body.dry_run ? "pending" : "settled",
      })

      createdRecords.push(record)
    }

    res.json({
      message: `Created ${createdRecords.length} profit sharing records`,
      records: createdRecords,
      total_amount: createdRecords.reduce((sum: number, r: any) => sum + Number(r.commission_amount), 0),
    })
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to process profit sharing" })
  }
}
