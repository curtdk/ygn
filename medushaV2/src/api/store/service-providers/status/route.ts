import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PROVIDER_MODULE } from "../../../../modules/service-provider"

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
  const serviceProviderService = req.scope.resolve(SERVICE_PROVIDER_MODULE)
  const loggedInUserId = (req as any).auth?.customer?.id || extractCustomerId(req)

  if (!loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const provider = await serviceProviderService.getServiceProviderByCustomerId(loggedInUserId)
  const applications = await serviceProviderService.listServiceProviderApplications({
    customer_id: loggedInUserId,
  })

  res.json({
    is_provider: provider?.status === "approved",
    provider,
    application: applications[0] || null,
  })
}