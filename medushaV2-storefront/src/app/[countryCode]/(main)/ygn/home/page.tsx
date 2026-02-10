import { Metadata } from "next"
import YgnHomeTemplate from "@modules/ygn/templates/home"

export const metadata: Metadata = {
  title: "忆光年 - 场景选择",
  description: "选择场景，开启回忆之旅",
}

export default async function YgnHomePage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  return <YgnHomeTemplate countryCode={params.countryCode} />
}
