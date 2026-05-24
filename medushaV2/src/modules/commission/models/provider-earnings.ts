import { model } from "@medusajs/framework/utils"

const ProviderEarnings = model.define("provider_earnings", {
  id: model.id().primaryKey(),
  provider_id: model.text(), // 服务商ID
  service_order_id: model.text(), // 服务订单ID
  order_id: model.text().nullable(), // 商城订单ID
  amount: model.number(), // 收入金额
  platform_fee: model.number().default(0), // 平台费用
  net_amount: model.number(), // 净收入
  status: model.enum(["pending", "settled", "withdrawn"]).default("pending"),
  settled_at: model.dateTime().nullable(),
})

export default ProviderEarnings