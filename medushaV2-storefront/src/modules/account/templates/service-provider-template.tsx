import { HttpTypes } from "@medusajs/types"
import ServiceProviderApplication from "../components/service-provider-application"
import ReferralCode from "../components/referral-code"

interface ServiceProviderTemplateProps {
  customer: HttpTypes.StoreCustomer | null
}

export default async function ServiceProviderTemplate({
  customer,
}: ServiceProviderTemplateProps) {
  return (
    <div className="py-12">
      <div className="content-container max-w-5xl mx-auto">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">服务商中心</h1>
            <p className="text-gray-500">管理您的服务商申请和推荐关系</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ServiceProviderApplication />
            <ReferralCode />
          </div>
        </div>
      </div>
    </div>
  )
}