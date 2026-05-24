import { Metadata } from "next"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { retrieveCustomer } from "@lib/data/customer"
import ServiceProviderTemplate from "@modules/account/templates/service-provider-template"

export const metadata: Metadata = {
  title: "服务商中心",
  description: "管理服务商申请和推荐关系",
}

export default async function ServiceProviderPage() {
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    notFound()
  }

  return <ServiceProviderTemplate customer={customer} />
}