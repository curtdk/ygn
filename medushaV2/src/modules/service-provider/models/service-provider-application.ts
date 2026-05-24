import { model } from "@medusajs/framework/utils"

const ServiceProviderApplication = model.define("service_provider_application", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  phone: model.text(),
  id_card_front: model.text(),
  id_card_back: model.text(),
  work_certificate: model.text().nullable(),
  honor_certificate: model.text().nullable(),
  status: model.enum(["pending", "approved", "rejected"]).default("pending"),
  rejection_reason: model.text().nullable(),
  reviewed_at: model.dateTime().nullable(),
  reviewed_by: model.text().nullable(),
})

export default ServiceProviderApplication