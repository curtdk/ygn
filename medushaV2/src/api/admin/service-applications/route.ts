import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PROVIDER_MODULE } from "../../../modules/service-provider"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const serviceProviderService = req.scope.resolve(SERVICE_PROVIDER_MODULE)

  const { limit = 20, offset = 0, status } = req.query

  const filters: any = {}
  if (status) {
    filters.status = status
  }

  const [applications, count] = await serviceProviderService.listAndCountServiceProviderApplications(
    filters,
    {
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      order: { created_at: "DESC" },
    }
  )

  res.json({
    applications,
    count,
    offset: parseInt(offset as string),
    limit: parseInt(limit as string),
  })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const serviceProviderService = req.scope.resolve(SERVICE_PROVIDER_MODULE)
  const loggedInUserId = (req as any).auth?.user?.id

  const { application_id, status, rejection_reason } = req.body as any

  if (!application_id) {
    return res.status(400).json({ error: "application_id is required" })
  }

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status. Must be 'approved' or 'rejected'" })
  }

  const application = await serviceProviderService.retrieveServiceProviderApplication(application_id)

  if (application.status !== "pending") {
    return res.status(400).json({ error: "Application already processed" })
  }

  if (status === "approved") {
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

  const updated = await serviceProviderService.updateServiceProviderApplications({
    id: application_id,
    status,
    rejection_reason: status === "rejected" ? rejection_reason : null,
    reviewed_at: new Date(),
    reviewed_by: loggedInUserId,
  })

  res.json({ application: updated })
}
