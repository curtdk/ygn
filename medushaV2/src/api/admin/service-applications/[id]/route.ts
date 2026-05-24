import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PROVIDER_MODULE } from "../../../../modules/service-provider"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const serviceProviderService = req.scope.resolve(SERVICE_PROVIDER_MODULE)

  const application = await serviceProviderService.retrieveServiceProviderApplication(id)

  res.json({ application })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const { status, rejection_reason } = req.body
  const loggedInUserId = (req as any).auth?.user?.id
  const serviceProviderService = req.scope.resolve(SERVICE_PROVIDER_MODULE)

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status. Must be 'approved' or 'rejected'" })
  }

  const application = await serviceProviderService.retrieveServiceProviderApplication(id)

  if (application.status !== "pending") {
    return res.status(400).json({ error: "Application already processed" })
  }

  if (status === "approved") {
    // Create service provider record
    await serviceProviderService.createServiceProviders({
      customer_id: application.customer_id,
      status: "approved",
      phone: application.phone,
      id_card_front: application.id_card_front,
      id_card_back: application.id_card_back,
      work_certificate: application.work_certificate,
      honor_certificate: application.honor_certificate,
      approved_at: new Date(),
      approved_by: loggedInUserId,
    })
  }

  // Update application status
  const updated = await serviceProviderService.updateServiceProviderApplications(id, {
    status,
    rejection_reason: status === "rejected" ? rejection_reason : null,
    reviewed_at: new Date(),
    reviewed_by: loggedInUserId,
  })

  res.json({ application: updated })
}