import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { COMMISSION_MODULE } from "../../../modules/commission"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const commissionService = req.scope.resolve(COMMISSION_MODULE)
  const loggedInUserId = (req as any).auth?.customer?.id

  if (!loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const commissions = await commissionService.getReferrerCommissions(loggedInUserId)

  res.json({ commissions })
}