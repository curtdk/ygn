import ServiceTemplate from "@modules/service/templates/service-template"

export default async function ServicePage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  if (!countryCode) {
    return null
  }

  return <ServiceTemplate />
}
