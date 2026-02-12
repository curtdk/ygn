import { model } from "@medusajs/framework/utils"

const UserVideo = model.define("user_video", {
  id: model.id().primaryKey(),
  user_id: model.text(),
  order_id: model.text().nullable(),
  product_id: model.text(),
  video_url: model.text().nullable(),
  thumbnail_url: model.text().nullable(),
  title: model.text(),
  duration: model.number().default(0),
  status: model.enum(["pending", "processing", "completed", "failed"]).default("pending"),
  materials_used: model.json(),
  error_message: model.text().nullable(),
})

export default UserVideo
