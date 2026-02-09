import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import CategoryGrid from "@modules/home/components/category-grid"
import TrustSection from "@modules/home/components/trust-section"
import PromoBanner from "@modules/home/components/promo-banner"
import Newsletter from "@modules/home/components/newsletter"
import TrendingSection from "@modules/home/components/trending-section"
import SocialProof from "@modules/home/components/social-proof"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Premium Shopping Experience | Your Store Name",
  description:
    "Discover our curated collection of premium products. Free shipping on orders over $50. Shop the latest trends in fashion, home, and lifestyle.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      {/* Hero Section - Full width hero with CTA */}
      <Hero />

      {/* Trust/USP Section - Social proof and key benefits */}
      <TrustSection />

      {/* Category Grid - Visual navigation to main categories */}
      <CategoryGrid collections={collections} />

      {/* Trending/New Arrivals Section */}
      <div className="bg-gradient-to-b from-white to-neutral-50">
        <TrendingSection region={region} />
      </div>

      {/* Promotional Banner - Seasonal campaigns and special offers */}
      <PromoBanner />

      {/* Featured Products - Main product showcase by collection */}
      <div className="bg-neutral-50">
        <ul className="flex flex-col">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>

      {/* Social Proof - Customer testimonials and Instagram feed */}
      <SocialProof />

      {/* Newsletter Section - Email capture with incentive */}
      <Newsletter />
    </>
  )
}
