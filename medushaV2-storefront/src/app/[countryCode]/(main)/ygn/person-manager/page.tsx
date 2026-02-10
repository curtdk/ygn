import { Metadata } from "next"
import YgnPersonManagerTemplate from "@modules/ygn/templates/person-manager"

export const metadata: Metadata = {
  title: "忆光年 - 亲人管理",
  description: "管理亲人照片和声音",
}

export default async function YgnPersonManagerPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  return <YgnPersonManagerTemplate countryCode={params.countryCode} />
}
