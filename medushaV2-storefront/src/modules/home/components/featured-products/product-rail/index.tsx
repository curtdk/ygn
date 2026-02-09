import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { ArrowRight } from "@medusajs/icons"
import Link from "next/link"

import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
      limit: 8,
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  return (
    <div className="content-container py-12 small:py-20">
      {/* Section Header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <Text className="mb-2 text-sm font-medium uppercase tracking-wider text-neutral-500">
            Featured Collection
          </Text>
          <Heading level="h2" className="text-3xl font-bold text-neutral-900">
            {collection.title}
          </Heading>
        </div>
        <Link
          href={`/collections/${collection.handle}`}
          className="group hidden items-center gap-2 font-medium text-neutral-900 transition-colors hover:text-neutral-600 small:flex"
        >
          View All
          <ArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Products Grid */}
      <ul className="grid grid-cols-2 gap-4 small:grid-cols-3 small:gap-6 medium:grid-cols-4">
        {pricedProducts.map((product) => (
          <li key={product.id} className="group">
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>

      {/* Mobile View All Link */}
      <div className="mt-8 text-center small:hidden">
        <Link
          href={`/collections/${collection.handle}`}
          className="inline-flex items-center gap-2 font-medium text-neutral-900 transition-colors hover:text-neutral-600"
        >
          View All Products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
