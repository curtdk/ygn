import { model } from "@medusajs/framework/utils"

const ServiceProduct = model.define("service_product", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  title: model.text(),
  service_type: model.text(),
  description: model.text().nullable(),
  image_url: model.text().nullable(),
  estimated_duration: model.number().nullable(),
  requirements: model.json().nullable(),
  provider_id: model.text().nullable(),
  commission_rate: model.number().default(0.10),
  profit_sharing_level1: model.number().default(0.10),
  profit_sharing_level2: model.number().default(0.05),
  profit_sharing_level3: model.number().default(0.02),
  is_active: model.boolean().default(true),
})

export default ServiceProduct