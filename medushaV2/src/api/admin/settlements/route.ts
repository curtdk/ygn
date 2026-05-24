import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { COMMISSION_MODULE } from "../../../modules/commission"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const commissionService = req.scope.resolve(COMMISSION_MODULE)

  const { limit = 20, offset = 0, status, referrer_id } = req.query

  const filters: any = {}
  if (status) filters.status = status
  if (referrer_id) filters.referrer_id = referrer_id

  const [settlements, count] = await commissionService.listAndCountCommissionSettlements(
    filters,
    {
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      order: { created_at: "DESC" },
    }
  )

  res.json({
    settlements,
    count,
    offset: parseInt(offset as string),
    limit: parseInt(limit as string),
  })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const commissionService = req.scope.resolve(COMMISSION_MODULE)

  const { referrer_id, total_amount, service_charge, payment_method, payment_account, notes } = req.body

  if (!referrer_id || !total_amount) {
    return res.status(400).json({ error: "referrer_id and total_amount are required" })
  }

  const settlement = await commissionService.createSettlement({
    referrer_id,
    total_amount,
    service_charge,
    payment_method,
    payment_account,
    notes,
  })

  res.status(201).json({ settlement })
}