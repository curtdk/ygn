import { Metadata } from "next"
import YgnSettingsTemplate from "@modules/ygn/templates/settings"

export const metadata: Metadata = {
  title: "忆光年 - 设置",
  description: "管理您的账户和偏好设置",
}

export default async function YgnSettingsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  return <YgnSettingsTemplate countryCode={params.countryCode} />
}
