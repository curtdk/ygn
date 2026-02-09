import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import Link from "next/link"
import ProductPreview from "@modules/products/components/product-preview"

type TrendingSectionProps = {
  region: HttpTypes.StoreRegion
}

const TrendingSection = async ({ region }: TrendingSectionProps) => {
  // Fetch latest products
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      fields: "*variants.calculated_price",
      limit: 4,
      order: "-created_at", // Most recent first
    },
  })

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-20">
      {/* Section Header */}
      <div className="mb-10 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-xs font-medium text-purple-900">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Trending Now
        </div>
        <Heading
          level="h2"
          className="mb-3 text-3xl font-bold text-neutral-900 small:text-4xl"
        >
          New Arrivals
        </Heading>
        <Text className="text-lg text-neutral-600">
          Fresh picks just for you — be the first to shop our latest drops
        </Text>
      </div>

      {/* Products Grid with Split Layout */}
      <div className="grid grid-cols-1 gap-6 medium:grid-cols-2">
        {/* Featured Large Product */}
        {products[0] && (
          <div className="group relative overflow-hidden rounded-2xl bg-neutral-100 medium:row-span-2">
            <Link
              href={`/products/${products[0].handle}`}
              className="block h-full"
            >
              <div className="flex h-96 flex-col justify-end p-8 medium:h-full">
                <div className="relative z-10">
                  <div className="mb-2 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm">
                    Featured
                  </div>
                  <Heading level="h3" className="mb-2 text-2xl font-bold text-neutral-900">
                    {products[0].title}
                  </Heading>
                  {products[0].variants?.[0]?.calculated_price && (
                    <Text className="text-lg font-semibold text-neutral-700">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency:
                          products[0].variants[0].calculated_price.currency_code?.toUpperCase() ||
                          "USD",
                      }).format(
                        (products[0].variants[0].calculated_price
                          .calculated_amount || 0) / 100
                      )}
                    </Text>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          </div>
        )}

        {/* Grid of Smaller Products */}
        <div className="grid grid-cols-1 gap-6 small:grid-cols-2 medium:grid-cols-1">
          {products.slice(1, 4).map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-2xl bg-neutral-50 transition-transform hover:scale-[1.02]"
            >
              <ProductPreview product={product} region={region} isFeatured />
            </div>
          ))}
        </div>
      </div>

      {/* View All Link */}
      <div className="mt-10 text-center">
        <Link
          href="/store"
          className="group inline-flex items-center gap-2 rounded-full border-2 border-neutral-900 px-6 py-3 font-semibold text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white"
        >
          Explore All New Arrivals
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export default TrendingSection
