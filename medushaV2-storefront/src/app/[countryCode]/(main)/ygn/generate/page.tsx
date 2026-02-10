import { Metadata } from "next"
import YgnGenerateTemplate from "@modules/ygn/templates/generate"

export const metadata: Metadata = {
  title: "忆光年 - 生成视频",
  description: "AI正在为您制作专属回忆",
}

export default async function YgnGeneratePage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  return <YgnGenerateTemplate countryCode={params.countryCode} />
}
