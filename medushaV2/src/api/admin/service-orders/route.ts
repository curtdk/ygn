import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PRODUCT_MODULE } from "../../../modules/service-product"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)

  const { limit = 20, offset = 0, status, provider_id, customer_id } = req.query

  const filters: any = {}
  if (status) filters.status = status
  if (provider_id) filters.provider_id = provider_id
  if (customer_id) filters.customer_id = customer_id

  const [orders, count] = await serviceProductService.listAndCountServiceOrders(
    filters,
    {
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      order: { created_at: "DESC" },
    }
  )

  res.json({
    orders,
    count,
    offset: parseInt(offset as string),
    limit: parseInt(limit as string),
  })
}