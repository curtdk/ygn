import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { VIDEO_MATERIAL_MODULE } from "../../../../modules/video-material"

// 更新素材
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const videoMaterialService = req.scope.resolve(VIDEO_MATERIAL_MODULE)
  const materialId = req.params.id
  const updateData = req.body as Record<string, any>

  const material = await videoMaterialService.updateVideoMaterials({
    id: materialId,
    ...updateData
  })

  res.json({ material })
}

// 删除素材
export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const videoMaterialService = req.scope.resolve(VIDEO_MATERIAL_MODULE)
  const materialId = req.params.id

  await videoMaterialService.deleteVideoMaterials([materialId])

  res.json({
    id: materialId,
    deleted: true
  })
}
