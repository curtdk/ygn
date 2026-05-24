import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PRODUCT_MODULE } from "../../../../modules/service-product"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)
  const { id } = req.params

  const order = await serviceProductService.retrieveServiceOrder(id)

  res.json({ order })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)
  const loggedInUserId = (req as any).auth?.customer?.id
  const { id } = req.params
  const { action, result_url, result_thumbnail } = req.body

  if (!loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const order = await serviceProductService.retrieveServiceOrder(id)

  // Check authorization
  if (order.customer_id !== loggedInUserId && order.provider_id !== loggedInUserId) {
    return res.status(403).json({ error: "Not authorized" })
  }

  if (action === "accept") {
    // Provider accepts the order
    const updated = await serviceProductService.acceptOrder(id, loggedInUserId)
    return res.json({ order: updated })
  }

  if (action === "complete") {
    // Provider completes the order
    if (!result_url) {
      return res.status(400).json({ error: "result_url is required" })
    }
    const updated = await serviceProductService.completeOrder(id, result_url, result_thumbnail)
    return res.json({ order: updated })
  }

  if (action === "cancel") {
    const updated = await serviceProductService.updateServiceOrders(id, {
      status: "cancelled",
    })
    return res.json({ order: updated })
  }

  return res.status(400).json({ error: "Invalid action" })
}