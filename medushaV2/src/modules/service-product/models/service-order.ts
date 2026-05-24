import { model } from "@medusajs/framework/utils"

const ServiceOrder = model.define("service_order", {
  id: model.id().primaryKey(),
  order_id: model.text(), // 关联的商城订单
  customer_id: model.text(),
  provider_id: model.text().nullable(), // 接单的服务商
  service_product_id: model.text(),
  status: model.enum([
    "pending",      // 待接单
    "accepted",     // 已接单
    "in_progress",  // 服务中
    "completed",   // 已完成
    "cancelled",   // 已取消
    "disputed"      // 有争议
  ]).default("pending"),
  requirements: model.json().nullable(),
  result_url: model.text().nullable(),
  result_thumbnail: model.text().nullable(),
  completion_note: model.text().nullable(),
  provider_earnings: model.number().nullable(), // 服务商收入
  platform_fee: model.number().nullable(), // 平台费用
  started_at: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  rating: model.number().nullable(), // 客户评分 1-5
  review_comment: model.text().nullable(), // 评价内容
  reviewed_at: model.dateTime().nullable(), // 评价时间
})

export default ServiceOrder