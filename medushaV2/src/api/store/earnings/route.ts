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

  const earnings = await commissionService.listProviderEarnings({
    provider_id: loggedInUserId,
  }, {
    order: { created_at: "DESC" },
  })

  res.json({ earnings })
}