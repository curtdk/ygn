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
