import { model } from "@medusajs/framework/utils"

const CommissionSettlement = model.define("commission_settlement", {
  id: model.id().primaryKey(),
  referrer_id: model.text(), // 服务商ID
  total_amount: model.number(), // 结算总金额
  service_charge: model.number().default(0), // 手续费
  actual_amount: model.number(), // 实际金额
  status: model.enum(["pending", "processing", "completed", "failed"]).default("pending"),
  payment_method: model.enum(["alipay", "bank", "wechat"]).nullable(),
  payment_account: model.text().nullable(),
  payment_proof: model.text().nullable(), // 付款凭证
  processed_at: model.dateTime().nullable(),
  processed_by: model.text().nullable(),
  notes: model.text().nullable(),
})

export default CommissionSettlement