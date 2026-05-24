import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PRODUCT_MODULE } from "../../../../modules/service-product"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const customerId = (req as any).auth?.actor_id

    if (!customerId) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)

    // 所有 pending 且未分配的订单（抢单池）
    const availableOrders = await serviceProductService.listServiceOrders(
      { status: "pending", assigned_provider_id: null },
      { order: { created_at: "DESC" } }
    )

    // 该服务商已接的订单
    const myOrders = await serviceProductService.listServiceOrders(
      { provider_id: customerId },
      { order: { created_at: "DESC" } }
    )

    // 合并去重
    const myOrderIds = new Set(myOrders.map((o: any) => o.id))
    const combined = [
      ...myOrders,
      ...availableOrders.filter((o: any) => !myOrderIds.has(o.id)),
    ]

    res.json({ orders: combined, count: combined.length })
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch provider orders" })
  }
}
