import { MedusaService } from "@medusajs/framework/utils"
import ServiceProduct from "./models/service-product"
import ServiceOrder from "./models/service-order"
import ServicePricing from "./models/service-pricing"

class ServiceProductModuleService extends MedusaService({
  ServiceProduct,
  ServiceOrder,
  ServicePricing,
}) {
  // ===== Service Product Methods =====
  
  async getServiceProducts() {
    return await this.listServiceProducts({
      is_active: true,
    })
  }

  async getServiceProductById(id: string) {
    return await this.retrieveServiceProduct(id)
  }

  async createServiceProduct(data: {
    title: string
    description?: string
    image_url?: string
    commission_rate?: number
    profit_sharing_level1?: number
    profit_sharing_level2?: number
    profit_sharing_level3?: number
    is_active?: boolean
  }) {
    return await this.createServiceProducts({
      ...data,
      is_active: data.is_active ?? true,
    })
  }

  // ===== Service Order Methods =====

  async createServiceOrder(data: {
    order_id: string
    customer_id: string
    service_product_id: string
    requirements?: any
    service_address?: string
    service_date?: string
    notes?: string
  }) {
    return await this.createServiceOrders({
      ...data,
      status: "pending",
    })
  }

  async acceptOrder(orderId: string, providerId: string) {
    const order = await this.retrieveServiceOrder(orderId)
    if (order.status !== "pending") {
      throw new Error("Order is not in pending status")
    }
    return await this.updateServiceOrders({
      id: orderId,
      provider_id: providerId,
      status: "accepted",
    })
  }

  async startOrder(orderId: string) {
    return await this.updateServiceOrders({
      id: orderId,
      status: "in_progress",
      started_at: new Date(),
    })
  }

  async completeOrder(orderId: string, resultUrl: string, resultThumbnail?: string) {
    return await this.updateServiceOrders({
      id: orderId,
      status: "completed",
      result_url: resultUrl,
      result_thumbnail: resultThumbnail || null,
      completed_at: new Date(),
    })
  }

  async reviewOrder(orderId: string, rating: number, comment?: string) {
    return await this.updateServiceOrders({
      id: orderId,
      rating,
      review_comment: comment || null,
      reviewed_at: new Date(),
    })
  }

  async cancelOrder(orderId: string, reason?: string) {
    return await this.updateServiceOrders({
      id: orderId,
      status: "cancelled",
      completion_note: reason || null,
    })
  }

  async grabOrder(orderId: string, providerId: string, grabRecords: any[]) {
    const updatedRecords = [...grabRecords, {
      provider_id: providerId,
      grabbed_at: new Date().toISOString(),
    }]
    
    return await this.updateServiceOrders({
      id: orderId,
      grab_records: JSON.stringify(updatedRecords),
    })
  }

  async assignOrder(orderId: string, providerId: string) {
    return await this.updateServiceOrders({
      id: orderId,
      provider_id: providerId,
      assigned_provider_id: providerId,
      status: "accepted",
      started_at: new Date(),
    })
  }

  async approveOrder(orderId: string) {
    return await this.updateServiceOrders({
      id: orderId,
      status: "pending",
    })
  }

  async rejectOrder(orderId: string) {
    return await this.updateServiceOrders({
      id: orderId,
      status: "cancelled",
    })
  }

  async disputeOrder(orderId: string) {
    return await this.updateServiceOrders({
      id: orderId,
      status: "disputed",
    })
  }

  async updateOrderFields(orderId: string, updateData: Record<string, any>) {
    return await this.updateServiceOrders({
      id: orderId,
      ...updateData,
    })
  }

  // ===== Query Methods =====

  async getProviderOrders(providerId: string, filters?: any) {
    return await this.listServiceOrders({
      provider_id: providerId,
      ...filters,
    }, {
      order: { created_at: "DESC" },
    })
  }

  async getCustomerOrders(customerId: string, filters?: any) {
    return await this.listServiceOrders({
      customer_id: customerId,
      ...filters,
    }, {
      order: { created_at: "DESC" },
    })
  }

  async getPendingOrders() {
    return await this.listServiceOrders({
      status: "pending",
    }, {
      order: { created_at: "DESC" },
    })
  }

  async getAvailableForGrabOrders() {
    return await this.listServiceOrders({
      status: "pending",
      assigned_provider_id: null,
    }, {
      order: { created_at: "DESC" },
    })
  }

  async getPricingForProduct(productId: string, providerId?: string) {
    if (providerId) {
      const providerPricing = await this.listServicePricings({
        product_id: productId,
        provider_id: providerId,
        is_active: true,
      })
      if (providerPricing.length > 0) {
        return providerPricing[0]
      }
    }
    const defaultPricing = await this.listServicePricings({
      product_id: productId,
      provider_id: null,
      is_active: true,
    })
    return defaultPricing[0] || null
  }

  async getOrderStats(providerId?: string) {
    const filter = providerId ? { provider_id: providerId } : {}
    
    const allOrders = await this.listServiceOrders(filter)
    const pendingOrders = await this.listServiceOrders({ ...filter, status: "pending" })
    const acceptedOrders = await this.listServiceOrders({ ...filter, status: "accepted" })
    const inProgressOrders = await this.listServiceOrders({ ...filter, status: "in_progress" })
    const completedOrders = await this.listServiceOrders({ ...filter, status: "completed" })
    const cancelledOrders = await this.listServiceOrders({ ...filter, status: "cancelled" })

    return {
      total: allOrders.length,
      pending: pendingOrders.length,
      accepted: acceptedOrders.length,
      in_progress: inProgressOrders.length,
      completed: completedOrders.length,
      cancelled: cancelledOrders.length,
    }
  }
}

export default ServiceProductModuleService