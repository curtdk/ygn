import { Metadata } from "next"
import YgnShareTemplate from "@modules/ygn/templates/share"

export const metadata: Metadata = {
  title: "忆光年 - 分享视频",
  description: "分享您的回忆视频",
}

export default async function YgnSharePage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  return <YgnShareTemplate countryCode={params.countryCode} />
}
