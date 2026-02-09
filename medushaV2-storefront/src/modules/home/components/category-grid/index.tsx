import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import Link from "next/link"

type CategoryGridProps = {
  collections: HttpTypes.StoreCollection[]
}

const CategoryGrid = ({ collections }: CategoryGridProps) => {
  // Take first 4 collections for featured display
  const featuredCollections = collections.slice(0, 4)

  return (
    <div className="content-container py-12 small:py-20">
      {/* Section Header */}
      <div className="mb-10 text-center">
        <Heading
          level="h2"
          className="mb-3 text-3xl font-bold text-neutral-900 small:text-4xl"
        >
          Shop by Category
        </Heading>
        <Text className="text-lg text-neutral-600">
          Explore our carefully curated collections
        </Text>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-4 small:grid-cols-2 medium:grid-cols-4 medium:gap-6">
        {featuredCollections.map((collection, index) => {
          // Different layouts for visual interest
          const isLarge = index === 0
          const spanClass = isLarge
            ? "small:col-span-2 small:row-span-2"
            : ""

          return (
            <Link
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${spanClass} ${getCategoryGradient(
                index
              )}`}
            >
              <div
                className={`flex flex-col justify-end p-6 transition-all duration-300 ${
                  isLarge ? "h-96 small:h-full" : "h-64"
                }`}
              >
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-10" />

                {/* Content */}
                <div className="relative z-10">
                  <Text className="mb-2 text-sm font-medium uppercase tracking-wider text-neutral-700">
                    Collection
                  </Text>
                  <Heading
                    level="h3"
                    className={`font-bold text-neutral-900 ${
                      isLarge ? "text-3xl small:text-4xl" : "text-2xl"
                    }`}
                  >
                    {collection.title}
                  </Heading>

                  {/* Arrow Icon */}
                  <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:translate-x-1">
                    <svg
                      className="h-5 w-5 text-neutral-900"
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
                  </div>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute right-0 top-0 h-32 w-32 opacity-20">
                  <div className="absolute inset-0 bg-white blur-2xl"></div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* View All Link */}
      {collections.length > 4 && (
        <div className="mt-10 text-center">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 font-medium text-neutral-900 transition-colors hover:text-neutral-600"
          >
            View All Collections
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}

// Helper function for category gradients
const getCategoryGradient = (index: number): string => {
  const gradients = [
    "from-purple-100 to-pink-100",
    "from-blue-100 to-cyan-100",
    "from-amber-100 to-orange-100",
    "from-emerald-100 to-teal-100",
  ]
  return gradients[index % gradients.length]
}

export default CategoryGrid
