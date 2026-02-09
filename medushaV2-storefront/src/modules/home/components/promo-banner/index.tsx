import { Button, Heading, Text } from "@medusajs/ui"
import Link from "next/link"

const PromoBanner = () => {
  return (
    <div className="content-container py-12 small:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-4 top-0 h-72 w-72 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -right-4 bottom-0 h-72 w-72 rounded-full bg-white blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 py-16 text-center small:px-12 small:py-20">
          {/* Limited Time Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            Limited Time Offer
          </div>

          <Heading
            level="h2"
            className="mb-4 text-3xl font-bold text-white small:text-4xl medium:text-5xl"
          >
            Spring Sale — Up to 40% Off
          </Heading>

          <Text className="mb-8 text-lg text-neutral-300 small:text-xl">
            Refresh your wardrobe with our exclusive spring collection.
            <br className="hidden small:block" />
            Use code <span className="font-semibold text-white">SPRING2026</span> at checkout.
          </Text>

          {/* CTA */}
          <Link href="/store">
            <Button
              size="large"
              className="bg-white text-neutral-900 hover:bg-neutral-100"
            >
              Shop the Sale
            </Button>
          </Link>

          {/* Countdown Timer (Static for now) */}
          <div className="mt-10 flex justify-center gap-4 text-white">
            <div className="flex flex-col items-center">
              <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-lg bg-white/10 text-2xl font-bold backdrop-blur-sm">
                03
              </div>
              <Text className="text-xs uppercase tracking-wider text-neutral-400">
                Days
              </Text>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-lg bg-white/10 text-2xl font-bold backdrop-blur-sm">
                12
              </div>
              <Text className="text-xs uppercase tracking-wider text-neutral-400">
                Hours
              </Text>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-lg bg-white/10 text-2xl font-bold backdrop-blur-sm">
                45
              </div>
              <Text className="text-xs uppercase tracking-wider text-neutral-400">
                Mins
              </Text>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-lg bg-white/10 text-2xl font-bold backdrop-blur-sm">
                23
              </div>
              <Text className="text-xs uppercase tracking-wider text-neutral-400">
                Secs
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromoBanner
