import { MedusaService } from "@medusajs/framework/utils"
import ServiceProduct from "./models/service-product"
import ServiceOrder from "./models/service-order"
import ServicePricing from "./models/service-pricing"

class ServiceProductModuleService extends MedusaService({
  ServiceProduct,
  ServiceOrder,
  ServicePricing,
}) {
  async getServiceProducts() {
    return await this.listServiceProducts({
      is_active: true,
    })
  }

  async getServiceProductById(id: string) {
    return await this.retrieveServiceProduct(id)
  }

  async createServiceOrder(data: {
    order_id: string
    customer_id: string
    service_product_id: string
    requirements?: any
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
    return await this.updateServiceOrders(orderId, {
      provider_id: providerId,
      status: "accepted",
    })
  }

  async completeOrder(orderId: string, resultUrl: string, resultThumbnail?: string) {
    return await this.updateServiceOrders(orderId, {
      status: "completed",
      result_url: resultUrl,
      result_thumbnail: resultThumbnail || null,
      completed_at: new Date(),
    })
  }

  async getProviderOrders(providerId: string) {
    return await this.listServiceOrders({
      provider_id: providerId,
    }, {
      order: { created_at: "DESC" },
    })
  }

  async getCustomerOrders(customerId: string) {
    return await this.listServiceOrders({
      customer_id: customerId,
    }, {
      order: { created_at: "DESC" },
    })
  }

  async getPricingForProduct(productId: string, providerId?: string) {
    // Try provider-specific pricing first
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
    // Fall back to default pricing
    const defaultPricing = await this.listServicePricings({
      product_id: productId,
      provider_id: null,
      is_active: true,
    })
    return defaultPricing[0] || null
  }
}

export default ServiceProductModuleService