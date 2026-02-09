 import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"

const categories = [
  {
    id: 1,
    title: "Men's Fashion",
    description: "Trendy clothing & accessories",
    imageColor: "bg-gradient-to-br from-blue-500 to-blue-700",
    href: "/collections/mens-fashion",
  },
  {
    id: 2,
    title: "Women's Fashion",
    description: "Elegant styles & designs",
    imageColor: "bg-gradient-to-br from-pink-500 to-rose-600",
    href: "/collections/womens-fashion",
  },
  {
    id: 3,
    title: "Electronics",
    description: "Latest gadgets & tech",
    imageColor: "bg-gradient-to-br from-purple-500 to-indigo-600",
    href: "/collections/electronics",
  },
  {
    id: 4,
    title: "Home & Living",
    description: "Comfort for your space",
    imageColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
    href: "/collections/home-living",
  },
  {
    id: 5,
    title: "Beauty & Health",
    description: "Self-care essentials",
    imageColor: "bg-gradient-to-br from-amber-500 to-orange-600",
    href: "/collections/beauty-health",
  },
  {
    id: 6,
    title: "Sports & Outdoors",
    description: "Active lifestyle gear",
    imageColor: "bg-gradient-to-br from-red-500 to-red-700",
    href: "/collections/sports-outdoors",
  },
]

export default function CategoriesGrid() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="content-container">
        <div className="text-center mb-12">
          <Text className="text-3xl font-bold text-gray-900 mb-4">
            Shop by Category
          </Text>
          <Text className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover products curated for every aspect of your life
          </Text>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Text className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                      {category.title}
                    </Text>
                    <Text className="text-gray-500 mt-1">
                      {category.description}
                    </Text>
                  </div>
                  <div className={`w-16 h-16 rounded-xl ${category.imageColor} opacity-20 group-hover:opacity-30 transition-opacity`} />
                </div>
                
                <InteractiveLink
                  href={category.href}
                  className="mt-4 inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 group-hover:translate-x-1 transition-transform"
                >
                  Shop Now
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </InteractiveLink>
              </div>
              
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <InteractiveLink
            href="/collections"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            View All Categories
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </InteractiveLink>
        </div>
      </div>
    </div>
  )
}
