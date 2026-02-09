import { ArrowRight } from "@medusajs/icons"
import { Button, Heading, Text } from "@medusajs/ui"
import Link from "next/link"

const Hero = () => {
  return (
    <div className="relative w-full">
      {/* Main Hero Section */}
      <div className="relative h-[85vh] w-full overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
        {/* Background Pattern/Image */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        
        {/* Content */}
        <div className="content-container relative z-10 flex h-full flex-col justify-center">
          <div className="max-w-3xl">
            {/* Seasonal Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-medium text-white">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
              </span>
              Spring Collection 2026 — Now Live
            </div>

            {/* Main Heading */}
            <Heading
              level="h1"
              className="mb-6 text-5xl font-bold leading-tight tracking-tight text-neutral-900 small:text-6xl medium:text-7xl"
            >
              Discover Your
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Style</span>
            </Heading>

            {/* Subheading */}
            <Text className="mb-8 text-lg text-neutral-600 small:text-xl medium:max-w-2xl">
              Explore our curated collection of premium products designed for modern living. 
              Quality craftsmanship meets contemporary design.
            </Text>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 small:flex-row">
              <Link href="/store">
                <Button 
                  size="large" 
                  className="w-full small:w-auto bg-neutral-900 hover:bg-neutral-800 text-white"
                >
                  Shop Now
                  <ArrowRight />
                </Button>
              </Link>
              <Link href="/collections/new-arrivals">
                <Button 
                  size="large" 
                  variant="secondary"
                  className="w-full small:w-auto"
                >
                  New Arrivals
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free Shipping Over $50
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                30-Day Returns
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 right-0 hidden h-96 w-96 opacity-30 medium:block">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-400 to-pink-400 blur-3xl"></div>
        </div>
      </div>
    </div>
  )
}

export default Hero
