import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PROVIDER_MODULE } from "../../../modules/service-provider"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

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