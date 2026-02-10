import { Metadata } from "next"
import YgnRechargeTemplate from "@modules/ygn/templates/recharge"

export const metadata: Metadata = {
  title: "忆光年 - 积分充值",
  description: "购买积分，创作更多回忆",
}

export default async function YgnRechargePage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  return <YgnRechargeTemplate countryCode={params.countryCode} />
}
