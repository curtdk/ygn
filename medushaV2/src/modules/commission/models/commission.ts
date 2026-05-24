import { model } from "@medusajs/framework/utils"

const Commission = model.define("commission", {
  id: model.id().primaryKey(),
  customer_id: model.text(), // 被推荐客户ID
  referrer_id: model.text(), // 推荐人ID
  order_id: model.text(), // 关联订单ID
  service_order_id: model.text().nullable(), // 服务订单ID
  level: model.number(), // 推荐层级 (1, 2, 3)
  commission_type: model.enum(["order", "service"]).default("order"),
  order_amount: model.number(), // 订单金额
  commission_rate: model.number(), // 佣金比例
  commission_amount: model.number(), // 佣金金额
  status: model.enum(["pending", "settled", "withdrawn", "cancelled"]).default("pending"),
  settled_at: model.dateTime().nullable(),
  settled_by: model.text().nullable(),
})

export default Commission