import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PRODUCT_MODULE } from "../../../modules/service-product"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)

  const { limit = 20, offset = 0 } = req.query

  const [products, count] = await serviceProductService.listAndCountServiceProducts(
    {},
    {
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      order: { created_at: "DESC" },
    }
  )

  res.json({
    service_products: products,
    count,
    offset: parseInt(offset as string),
    limit: parseInt(limit as string),
  })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)

  const { product_id, service_type, description, estimated_duration, requirements, is_active } = req.body

  if (!product_id || !service_type) {
    return res.status(400).json({ error: "product_id and service_type are required" })
  }

  const product = await serviceProductService.createServiceProducts({
    product_id,
    service_type,
    description: description || null,
    estimated_duration: estimated_duration || null,
    requirements: requirements || null,
    is_active: is_active !== false,
  })

  res.status(201).json({ service_product: product })
}