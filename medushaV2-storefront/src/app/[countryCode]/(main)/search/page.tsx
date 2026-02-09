import { Metadata } from "next"
import { notFound } from "next/navigation"
import SearchTemplate from "@modules/search/templates"

export const metadata: Metadata = {
  title: "搜索产品",
  description: "搜索您需要的产品",
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ q?: string; page?: string; sort?: string }>
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const { q, page, sort } = await searchParams

  if (!q || q.trim().length === 0) {
    notFound()
  }

  const currentPage = page ? parseInt(page) : 1

  return (
    <SearchTemplate
      query={q}
      countryCode={countryCode}
      page={currentPage}
      sortBy={sort as any}
    />
  )
}
