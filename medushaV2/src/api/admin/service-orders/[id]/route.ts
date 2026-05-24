import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PRODUCT_MODULE } from "../../../../modules/service-product"
import { COMMISSION_MODULE } from "../../../../modules/commission"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)

  try {
    const order = await serviceProductService.retrieveServiceOrder(id)
    res.json({ order })
  } catch (error) {
    res.status(404).json({ error: "Order not found" })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const body = req.body as any
  const { action } = body
  const loggedInUserId = (req as any).auth?.user?.id
  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)
  const commissionService = req.scope.resolve(COMMISSION_MODULE)

  try {
    const order = await serviceProductService.retrieveServiceOrder(id)

    switch (action) {
      case "approve":
        const approved = await serviceProductService.updateServiceOrders({
          id,
          status: "pending",
        })
        return res.json({ order: approved, message: "Order approved successfully" })

      case "reject":
        const rejected = await serviceProductService.updateServiceOrders({
          id,
          status: "cancelled",
        })
        return res.json({ order: rejected, message: "Order rejected" })

      case "assign":
        const { provider_id } = body
        if (!provider_id) {
          return res.status(400).json({ error: "provider_id is required" })
        }
        const assigned = await serviceProductService.updateServiceOrders({
          id,
          provider_id,
          assigned_provider_id: provider_id,
          status: "accepted",
          started_at: new Date(),
        })
        return res.json({ order: assigned, message: "Order assigned successfully" })

      case "cancel":
        const cancelled = await serviceProductService.updateServiceOrders({
          id,
          status: "cancelled",
        })
        return res.json({ order: cancelled, message: "Order cancelled" })

      case "start":
        const started = await serviceProductService.updateServiceOrders({
          id,
          status: "in_progress",
          started_at: new Date(),
        })
        return res.json({ order: started, message: "Service started" })

      case "complete":
        const { result_url, result_thumbnail, completion_note, order_amount, platform_fee } = body
        const completed = await serviceProductService.updateServiceOrders({
          id,
          status: "completed",
          result_url: result_url || null,
          result_thumbnail: result_thumbnail || null,
          completion_note: completion_note || null,
          completed_at: new Date(),
        })

        if (completed.provider_id && order_amount) {
          await commissionService.createProviderEarning({
            provider_id: completed.provider_id,
            service_order_id: id,
            order_id: completed.order_id,
            amount: order_amount,
            platform_fee: platform_fee || 0,
          })
        }

        return res.json({ order: completed, message: "Service completed" })

      case "auto_complete":
        const autoCompleted = await serviceProductService.updateServiceOrders({
          id,
          status: "completed",
          completed_at: new Date(),
        })
        return res.json({ order: autoCompleted, message: "Order auto-completed" })

      case "dispute":
        const disputed = await serviceProductService.updateServiceOrders({
          id,
          status: "disputed",
        })
        return res.json({ order: disputed, message: "Order marked as disputed" })

      default:
        return res.status(400).json({ 
          error: `Invalid action: ${action}`,
          valid_actions: ["approve", "reject", "assign", "cancel", "start", "complete", "auto_complete", "dispute"]
        })
    }
  } catch (error: any) {
    if (error.message?.includes("not found")) {
      return res.status(404).json({ error: "Order not found" })
    }
    return res.status(500).json({ error: error.message || "Failed to process order action" })
  }
}

export async function PATCH(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.params
  const body = req.body as any
  const serviceProductService = req.scope.resolve(SERVICE_PRODUCT_MODULE)

  try {
    const updateData: Record<string, any> = { id }
    
    if (body.service_address !== undefined) updateData.service_address = body.service_address
    if (body.service_date !== undefined) updateData.service_date = body.service_date
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.address_id !== undefined) updateData.address_id = body.address_id
    if (body.contact !== undefined) updateData.service_address_contact = body.contact
    if (body.phone !== undefined) updateData.service_address_phone = body.phone

    const updated = await serviceProductService.updateServiceOrders(updateData)
    res.json({ order: updated })
  } catch (error: any) {
    if (error.message?.includes("not found")) {
      return res.status(404).json({ error: "Order not found" })
    }
    return res.status(500).json({ error: error.message || "Failed to update order" })
  }
}