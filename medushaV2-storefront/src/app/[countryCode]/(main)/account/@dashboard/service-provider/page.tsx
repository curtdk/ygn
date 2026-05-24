import { Metadata } from "next"
import ServiceProviderTemplate from "@modules/account/templates/service-provider-template"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "服务商申请",
  description: "申请成为平台服务提供商",
}

export default async function ServiceProviderPage() {
  const customer = await retrieveCustomer().catch(() => null)
  
  return <ServiceProviderTemplate customer={customer} />
}