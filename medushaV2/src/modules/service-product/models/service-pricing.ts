import { model } from "@medusajs/framework/utils"

const ServicePricing = model.define("service_pricing", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  provider_id: model.text().nullable(), // null means default pricing
  price_type: model.enum(["fixed", "percentage", "tiered"]).default("fixed"),
  base_price: model.number(),
  provider_rate: model.number().default(0.7), // 服务商分润比例 70%
  min_order_value: model.number().nullable(),
  max_discount: model.number().nullable(),
  is_active: model.boolean().default(true),
})

export default ServicePricing