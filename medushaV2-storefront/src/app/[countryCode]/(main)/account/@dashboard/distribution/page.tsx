import { Metadata } from "next"
import DistributionTemplate from "@modules/account/templates/distribution-template"

export const metadata: Metadata = {
  title: "分销中心",
  description: "管理您的服务商业务和推荐关系",
}

export default async function DistributionPage() {
  return <DistributionTemplate />
}