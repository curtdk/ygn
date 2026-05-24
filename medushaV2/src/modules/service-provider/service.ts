import { MedusaService } from "@medusajs/framework/utils"
import ServiceProvider from "./models/service-provider"
import ServiceProviderApplication from "./models/service-provider-application"
import CustomerReferral from "./models/customer-referral"

class ServiceProviderModuleService extends MedusaService({
  ServiceProvider,
  ServiceProviderApplication,
  CustomerReferral,
}) {
  async getServiceProviderByCustomerId(customerId: string) {
    const providers = await this.listServiceProviders({
      customer_id: customerId,
    })
    return providers[0] || null
  }

  async isApprovedProvider(customerId: string) {
    const provider = await this.getServiceProviderByCustomerId(customerId)
    return provider?.status === "approved"
  }

  async getReferralsByCustomerId(customerId: string) {
    return await this.listCustomerReferrals({
      referrer_id: customerId,
    })
  }

  async getReferralChain(customerId: string, maxLevel: number = 3) {
    const chain: Array<{ level: number; referrer_id: string }> = []
    let currentId = customerId
    let currentLevel = 1

    while (currentLevel <= maxLevel) {
      const referrals = await this.listCustomerReferrals({
        customer_id: currentId,
        level: currentLevel,
      })

      if (referrals.length === 0 || !referrals[0].referrer_id) {
        break
      }

      chain.push({
        level: currentLevel,
        referrer_id: referrals[0].referrer_id,
      })

      currentId = referrals[0].referrer_id
      currentLevel++
    }

    return chain
  }

  async generateReferralCode(): Promise<string> {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let code = ""
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return code
  }
}

export default ServiceProviderModuleService
export type { ServiceProviderModuleService }