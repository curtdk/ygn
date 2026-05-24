import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PRODUCT_MODULE } from "../../../../modules/service-product"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)
  const { id } = req.params
  try {
    const order = await serviceProductService.retrieveServiceOrder(id)
    res.json({ order })
  } catch {
    res.status(404).json({ error: "Order not found" })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)
  const customerId = (req as any).auth?.actor_id
  const { id } = req.params
  const body = req.body as any
  const { action, result_url, result_thumbnail, rating, comment } = body

  if (!customerId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  let order: any
  try {
    order = await serviceProductService.retrieveServiceOrder(id)
  } catch {
    return res.status(404).json({ error: "Order not found" })
  }

  // 授权检查：客户或已接服务商可操作
  const isCustomer = order.customer_id === customerId
  const isProvider = order.provider_id === customerId
  // accept 操作任意认证服务商都可执行（抢单）
  const isGrab = action === "accept" && !order.provider_id

  if (!isCustomer && !isProvider && !isGrab) {
    return res.status(403).json({ error: "Not authorized" })
  }

  try {
    switch (action) {
      case "accept": {
        if (order.status !== "pending") {
          return res.status(400).json({ error: "Order is not available for grabbing" })
        }
        const updated = await serviceProductService.acceptOrder(id, customerId)
        return res.json({ order: updated, message: "抢单成功" })
      }

      case "start": {
        if (order.status !== "accepted") {
          return res.status(400).json({ error: "Order must be in accepted status to start" })
        }
        const updateData: Record<string, any> = {
          id,
          status: "in_progress",
          started_at: new Date(),
        }
        if (result_url) updateData.result_url = result_url
        if (result_thumbnail) updateData.result_thumbnail = result_thumbnail
        const updated = await serviceProductService.updateServiceOrders(updateData)
        return res.json({ order: updated, message: "服务已开始" })
      }

      case "complete": {
        const updateData: Record<string, any> = {
          id,
          status: "completed",
          completed_at: new Date(),
        }
        if (result_url) updateData.result_url = result_url
        if (result_thumbnail) updateData.result_thumbnail = result_thumbnail
        const updated = await serviceProductService.updateServiceOrders(updateData)
        return res.json({ order: updated, message: "服务已完成" })
      }

      case "cancel": {
        const updated = await serviceProductService.updateServiceOrders({
          id,
          status: "cancelled",
        })
        return res.json({ order: updated, message: "订单已取消" })
      }

      case "review": {
        if (!isCustomer) {
          return res.status(403).json({ error: "Only customer can review" })
        }
        if (!rating || rating < 1 || rating > 5) {
          return res.status(400).json({ error: "rating must be 1-5" })
        }
        const updated = await serviceProductService.reviewOrder(id, rating, comment)
        return res.json({ order: updated, message: "评价成功" })
      }

      default:
        return res.status(400).json({ error: `Invalid action: ${action}` })
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Operation failed" })
  }
}
