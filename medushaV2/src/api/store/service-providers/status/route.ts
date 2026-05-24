import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PROVIDER_MODULE } from "../../../../modules/service-provider"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const serviceProviderService = req.scope.resolve(SERVICE_PROVIDER_MODULE)
  const loggedInUserId = (req as any).auth?.customer?.id

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