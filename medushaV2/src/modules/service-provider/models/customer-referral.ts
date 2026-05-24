import { model } from "@medusajs/framework/utils"

const CustomerReferral = model.define("customer_referral", {
  id: model.id().primaryKey(),
  customer_id: model.text(), // 当前用户
  referrer_id: model.text().nullable(), // 推荐人
  referee_id: model.text().nullable(), // 被推荐人
  level: model.number().default(1), // 推荐层级 1/2/3
  referral_code: model.text().nullable(), // 推荐码
})

export default CustomerReferral
