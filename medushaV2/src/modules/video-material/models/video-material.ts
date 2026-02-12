import { model } from "@medusajs/framework/utils"

const VideoMaterial = model.define("video_material", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  name: model.text(),
  material_key: model.text(),
  material_type: model.enum(["image", "audio", "background", "video"]),
  default_url: model.text(),
  is_replaceable: model.boolean().default(true),
  sort_order: model.number().default(0),
})

export default VideoMaterial
