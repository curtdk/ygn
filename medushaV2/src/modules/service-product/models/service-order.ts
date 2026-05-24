import { model } from "@medusajs/framework/utils"

const ServiceOrder = model.define("service_order", {
  id: model.id().primaryKey(),
  order_id: model.text(),
  customer_id: model.text(),
  provider_id: model.text().nullable(),
  service_product_id: model.text(),
  status: model.enum([
    "pending",      // 待接单
    "accepted",     // 已接单
    "in_progress",  // 服务中
    "completed",    // 已完成
    "cancelled",   // 已取消
    "disputed"      // 有争议
  ]).default("pending"),
  requirements: model.json().nullable(),
  result_url: model.text().nullable(),
  result_thumbnail: model.text().nullable(),
  completion_note: model.text().nullable(),
  provider_earnings: model.number().nullable(),
  platform_fee: model.number().nullable(),
  started_at: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  rating: model.number().nullable(),
  review_comment: model.text().nullable(),
  reviewed_at: model.dateTime().nullable(),
  // Additional fields for service module
  address_id: model.text().nullable(),
  service_address: model.text().nullable(),
  service_date: model.text().nullable(),
  notes: model.text().nullable(),
  grab_records: model.text().nullable(),
  assigned_provider_id: model.text().nullable(),
  auto_complete_at: model.text().nullable(),
  service_address_contact: model.text().nullable(),
  service_address_phone: model.text().nullable(),
})

export default ServiceOrder