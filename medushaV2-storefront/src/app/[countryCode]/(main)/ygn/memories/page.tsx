import { Metadata } from "next"
import YgnMemoriesTemplate from "@modules/ygn/templates/memories"

export const metadata: Metadata = {
  title: "忆光年 - 我的回忆",
  description: "浏览和管理您的回忆视频",
}

export default async function YgnMemoriesPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  return <YgnMemoriesTemplate countryCode={params.countryCode} />
}
