import { MedusaService } from "@medusajs/framework/utils"
import ServiceProvider from "./models/service-provider"
import ServiceProviderApplication from "./models/service-provider-application"
import CustomerReferral from "./models/customer-referral"

class ServiceProviderModuleService extends MedusaService({
  ServiceProvider,
  ServiceProviderApplication,
  CustomerReferral,
}) {
  async getReferralByCode(referralCode: string) {
    const referrals = await this.listCustomerReferrals({
      referral_code: referralCode,
    })
    return referrals[0] || null
  }

  async getProviderByCustomerId(customerId: string) {
    const providers = await this.listServiceProviders({
      customer_id: customerId,
    })
    return providers[0] || null
  }

  async createReferralIfNotExists(referrerId: string, refereeId: string, level: number) {
    // Check if referral already exists
    const existing = await this.listCustomerReferrals({
      referrer_id: referrerId,
      referee_id: refereeId,
    })
    
    if (existing.length > 0) {
      return existing[0]
    }

    // Generate a simple referral code
    const referralCode = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return await this.createCustomerReferrals({
      referrer_id: referrerId,
      referee_id: refereeId,
      level,
      referral_code: referralCode,
    })
  }
}

export default ServiceProviderModuleService