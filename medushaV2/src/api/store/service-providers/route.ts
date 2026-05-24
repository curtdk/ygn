import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PROVIDER_MODULE } from "../../../modules/service-provider"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const serviceProviderService = req.scope.resolve(SERVICE_PROVIDER_MODULE)
  const loggedInUserId = (req as any).auth?.customer?.id

  if (!loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { phone, id_card_front, id_card_back, work_certificate, honor_certificate } = req.body

  // Check if already has pending or approved application
  const existingApplication = await serviceProviderService.listServiceProviderApplications({
    customer_id: loggedInUserId,
    status: "pending",
  })

  if (existingApplication.length > 0) {
    return res.status(400).json({ error: "You already have a pending application" })
  }

  // Check if already approved provider
  const isApproved = await serviceProviderService.isApprovedProvider(loggedInUserId)
  if (isApproved) {
    return res.status(400).json({ error: "You are already a service provider" })
  }

  // Create application
  const application = await serviceProviderService.createServiceProviderApplications({
    customer_id: loggedInUserId,
    phone,
    id_card_front,
    id_card_back,
    work_certificate: work_certificate || null,
    honor_certificate: honor_certificate || null,
    status: "pending",
  })

  res.status(201).json({ application })
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const serviceProviderService = req.scope.resolve(SERVICE_PROVIDER_MODULE)
  const loggedInUserId = (req as any).auth?.customer?.id

  if (!loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const application = await serviceProviderService.listServiceProviderApplications({
    customer_id: loggedInUserId,
  })

  res.json({ application: application[0] || null })
}