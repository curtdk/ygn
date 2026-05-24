import { model } from "@medusajs/framework/utils"

const CustomerReferral = model.define("customer_referral", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  referrer_id: model.text().nullable(),
  level: model.number().default(1),
  referral_code: model.text().nullable(),
})

export default CustomerReferral