import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PRODUCT_MODULE } from "../../../modules/service-product"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)

  const products = await serviceProductService.listServiceProducts(
    { is_active: true },
    { order: { created_at: "DESC" } }
  )

  res.json({ service_products: products, count: products.length })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)
  const body = req.body as any

  const product = await serviceProductService.createServiceProducts({
    product_id: body.product_id || `sp_${Date.now()}`,
    title: body.title,
    service_type: body.service_type || "general",
    description: body.description || null,
    image_url: body.image_url || null,
    estimated_duration: body.estimated_duration || null,
    requirements: body.requirements || null,
    commission_rate: body.commission_rate ?? 0.10,
    profit_sharing_level1: body.profit_sharing_level1 ?? 0.10,
    profit_sharing_level2: body.profit_sharing_level2 ?? 0.05,
    profit_sharing_level3: body.profit_sharing_level3 ?? 0.02,
    is_active: body.is_active ?? true,
  })

  res.status(201).json({ service_product: product })
}
