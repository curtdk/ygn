import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PRODUCT_MODULE } from "../../../modules/service-product"

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

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const customerId = (req as any).auth?.actor_id || extractCustomerId(req)

  if (!customerId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)
  const { limit = 20, offset = 0, status } = req.query

  const filters: Record<string, any> = { customer_id: customerId }
  if (status) filters.status = status

  const [orders, count] = await serviceProductService.listAndCountServiceOrders(filters, {
    take: parseInt(limit as string),
    skip: parseInt(offset as string),
    order: { created_at: "DESC" },
  })

  res.json({ orders, count, offset: parseInt(offset as string), limit: parseInt(limit as string) })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const customerId = (req as any).auth?.actor_id || extractCustomerId(req)

  if (!customerId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { service_product_id, order_id, requirements, service_address, service_date, notes } = req.body as any

  if (!service_product_id) {
    return res.status(400).json({ error: "service_product_id is required" })
  }

  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)

  const order = await serviceProductService.createServiceOrders({
    order_id: order_id || `so_${Date.now()}`,
    customer_id: customerId,
    service_product_id,
    requirements: requirements || null,
    service_address: service_address || null,
    service_date: service_date || null,
    notes: notes || null,
    status: "pending",
  })

  res.status(201).json({ order, message: "Service order created successfully" })
}
