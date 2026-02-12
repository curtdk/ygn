import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VIDEO_MATERIAL_MODULE } from "../../../modules/video-material"

// 获取素材列表
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const videoMaterialService = req.scope.resolve(VIDEO_MATERIAL_MODULE)
  const { product_id } = req.query as Record<string, any>

  const filters = product_id ? { product_id: product_id as string } : {}

  const materials = await videoMaterialService.listVideoMaterials(filters, {
    order: { sort_order: "ASC" }
  })

  res.json({ materials })
}

// 创建素材
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const videoMaterialService = req.scope.resolve(VIDEO_MATERIAL_MODULE)
  const materialData = req.body as Record<string, any>

  const material = await videoMaterialService.createVideoMaterials(materialData)

  res.json({ material })
}
