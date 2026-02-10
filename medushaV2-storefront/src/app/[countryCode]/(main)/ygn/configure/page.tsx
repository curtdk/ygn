import { Metadata } from "next"
import YgnConfigureTemplate from "@modules/ygn/templates/configure"

export const metadata: Metadata = {
  title: "忆光年 - 配置角色",
  description: "选择参与角色和照片",
}

export default async function YgnConfigurePage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  return <YgnConfigureTemplate countryCode={params.countryCode} />
}
