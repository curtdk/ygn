import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VIDEO_MATERIAL_MODULE } from "../../../../../modules/video-material"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const videoMaterialService = req.scope.resolve(VIDEO_MATERIAL_MODULE)
  const productId = req.params.id

  const materials = await videoMaterialService.listVideoMaterials({
    product_id: productId,
  }, {
    order: { sort_order: "ASC" }
  })

  res.json({ materials })
}
