import { model } from "@medusajs/framework/utils"

const ServiceProvider = model.define("service_provider", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  status: model.enum(["pending", "approved", "rejected"]).default("pending"),
  phone: model.text().nullable(),
  id_card_front: model.text().nullable(),
  id_card_back: model.text().nullable(),
  work_certificate: model.text().nullable(),
  honor_certificate: model.text().nullable(),
  approved_at: model.dateTime().nullable(),
  rejected_at: model.dateTime().nullable(),
  rejection_reason: model.text().nullable(),
  approved_by: model.text().nullable(),
})

export default ServiceProvider