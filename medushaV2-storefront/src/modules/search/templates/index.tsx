import { searchProducts } from "@lib/data/search"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import SearchFilters from "@modules/search/components/search-filters"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Search from "@modules/common/icons/search"

type Props = {
  query: string
  countryCode: string
  page?: number
  sortBy?: "relevance" | "price_asc" | "price_desc" | "created_at"
}

const PRODUCTS_PER_PAGE = 12

export default async function SearchTemplate({
  query,
  countryCode,
  page = 1,
  sortBy = "relevance",
}: Props) {
  const region = await getRegion(countryCode)

  if (!region) {
    return (
      <div className="content-container py-6">
        <div className="text-center">
          <p className="text-ui-fg-subtle">区域未找到</p>
        </div>
      </div>
    )
  }

  const offset = (page - 1) * PRODUCTS_PER_PAGE
  const searchResult = await searchProducts({
    q: query,
    countryCode,
    limit: PRODUCTS_PER_PAGE,
    offset,
    sortBy,
  })

  const { products, count } = searchResult
  const totalPages = Math.ceil(count / PRODUCTS_PER_PAGE)

  return (
    <div className="content-container py-6">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Search size="24" className="text-ui-fg-subtle" />
          <h1 className="text-2xl-semi">
            搜索结果
          </h1>
        </div>
        <p className="text-ui-fg-subtle">
          为 <span className="font-medium text-ui-fg-base">&quot;{query}&quot;</span> 找到 {count} 个产品
        </p>
      </div>

      {count > 0 ? (
        <>
          {/* Filters */}
          <SearchFilters />

          {/* Products Grid */}
          <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8 mb-8">
            {products.map((product) => (
              <ProductPreview
                key={product.id}
                product={product}
                region={region}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {page > 1 && (
                <LocalizedClientLink
                  href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}${sortBy !== "relevance" ? `&sort=${sortBy}` : ""}`}
                  className="px-4 py-2 border border-ui-border-base rounded-md hover:bg-ui-bg-subtle transition-colors"
                >
                  上一页
                </LocalizedClientLink>
              )}

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                  ) {
                    return (
                      <LocalizedClientLink
                        key={p}
                        href={`/search?q=${encodeURIComponent(query)}&page=${p}${sortBy !== "relevance" ? `&sort=${sortBy}` : ""}`}
                        className={`px-3 py-2 rounded-md transition-colors ${
                          p === page
                            ? "bg-ui-fg-base text-white"
                            : "border border-ui-border-base hover:bg-ui-bg-subtle"
                        }`}
                      >
                        {p}
                      </LocalizedClientLink>
                    )
                  } else if (p === page - 2 || p === page + 2) {
                    return <span key={p} className="px-2">...</span>
                  }
                  return null
                })}
              </div>

              {page < totalPages && (
                <LocalizedClientLink
                  href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}${sortBy !== "relevance" ? `&sort=${sortBy}` : ""}`}
                  className="px-4 py-2 border border-ui-border-base rounded-md hover:bg-ui-bg-subtle transition-colors"
                >
                  下一页
                </LocalizedClientLink>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mb-4">
            <Search size="48" className="mx-auto text-ui-fg-disabled" />
          </div>
          <h2 className="text-xl-semi mb-2">未找到产品</h2>
          <p className="text-ui-fg-subtle mb-6">
            抱歉，没有找到与 &quot;{query}&quot; 相关的产品
          </p>
          <LocalizedClientLink
            href="/store"
            className="inline-block px-6 py-3 bg-ui-fg-base text-white rounded-md hover:bg-ui-fg-base/90 transition-colors"
          >
            浏览所有产品
          </LocalizedClientLink>
        </div>
      )}
    </div>
  )
}
