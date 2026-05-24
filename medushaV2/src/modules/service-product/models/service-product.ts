import { model } from "@medusajs/framework/utils"

const ServiceProduct = model.define("service_product", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  service_type: model.text(), // video_generation, photo_editing, etc.
  description: model.text().nullable(),
  estimated_duration: model.number().nullable(), // 预计服务时长(分钟)
  requirements: model.json().nullable(), // 服务要求JSON
  provider_id: model.text().nullable(), // 指定服务商ID
  is_active: model.boolean().default(true),
})

export default ServiceProduct