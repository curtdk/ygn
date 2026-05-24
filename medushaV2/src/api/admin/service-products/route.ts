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

  const body = req.body as any
  const { product_id, title, service_type, description, image_url, estimated_duration, requirements,
    commission_rate, profit_sharing_level1, profit_sharing_level2, profit_sharing_level3, is_active } = body

  if (!title) {
    return res.status(400).json({ error: "title is required" })
  }

  const product = await serviceProductService.createServiceProducts({
    product_id: product_id || `sp_${Date.now()}`,
    title,
    service_type: service_type || "general",
    description: description || null,
    image_url: image_url || null,
    estimated_duration: estimated_duration || null,
    requirements: requirements || null,
    commission_rate: commission_rate ?? 0.10,
    profit_sharing_level1: profit_sharing_level1 ?? 0.10,
    profit_sharing_level2: profit_sharing_level2 ?? 0.05,
    profit_sharing_level3: profit_sharing_level3 ?? 0.02,
    is_active: is_active !== false,
  })

  res.status(201).json({ service_product: product })
}