import { notFound } from "next/navigation"
import DistributionTemplate from "@modules/account/templates/distribution-template"

export default function DistributionPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = Promise.resolve(params)

  if (!countryCode) {
    return notFound()
  }

  return <DistributionTemplate />
}