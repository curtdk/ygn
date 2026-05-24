import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { COMMISSION_MODULE } from "../../../../modules/commission"

function extractCustomerId(req: MedusaRequest): string | null {
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7)
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      return payload.actor_id || payload.customer_id || payload.app_metadata?.customer_id || null
    } catch {}
  }
  return null
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const commissionService = req.scope.resolve(COMMISSION_MODULE)
  const loggedInUserId = (req as any).auth?.customer?.id || extractCustomerId(req)

  if (!loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const summary = await commissionService.getProviderEarningsSummary(loggedInUserId)

  res.json({ summary })
}