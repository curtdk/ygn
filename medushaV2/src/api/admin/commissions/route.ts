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

  const [commissions, count] = await commissionService.listAndCountCommissions(
    filters,
    {
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      order: { created_at: "DESC" },
    }
  )

  res.json({
    commissions,
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
  const loggedInUserId = (req as any).auth?.user?.id

  if (!loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { commission_id, action } = req.body

  if (!commission_id || !action) {
    return res.status(400).json({ error: "commission_id and action are required" })
  }

  if (action === "settle") {
    const commission = await commissionService.settleCommission(commission_id, loggedInUserId)
    return res.json({ commission })
  }

  return res.status(400).json({ error: "Invalid action" })
}