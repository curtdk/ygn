import { Heading, Text } from "@medusajs/ui"

const SocialProof = () => {
  const testimonials = [
    {
      quote: "The quality is outstanding! I've been a customer for over a year now.",
      author: "Sarah M.",
      rating: 5,
      verified: true,
    },
    {
      quote: "Fast shipping and excellent customer service. Highly recommend!",
      author: "James K.",
      rating: 5,
      verified: true,
    },
    {
      quote: "Love the modern designs and sustainable materials used.",
      author: "Emma L.",
      rating: 5,
      verified: true,
    },
  ]

  const stats = [
    { value: "50k+", label: "Happy Customers" },
    { value: "4.8/5", label: "Average Rating" },
    { value: "10k+", label: "5-Star Reviews" },
  ]

  return (
    <div className="border-y border-neutral-200 bg-white py-12 small:py-20">
      <div className="content-container">
        {/* Stats Section */}
        <div className="mb-16 grid grid-cols-3 gap-4 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col">
              <Heading
                level="h3"
                className="mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent small:text-4xl"
              >
                {stat.value}
              </Heading>
              <Text className="text-xs text-neutral-600 small:text-sm">
                {stat.label}
              </Text>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="mb-10 text-center">
          <Heading
            level="h2"
            className="mb-3 text-3xl font-bold text-neutral-900 small:text-4xl"
          >
            Loved by Thousands
          </Heading>
          <Text className="text-lg text-neutral-600">
            See what our customers are saying about us
          </Text>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 small:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 transition-all hover:border-neutral-300 hover:shadow-lg"
            >
              {/* Star Rating */}
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-5 w-5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <Text className="mb-4 text-neutral-700">
                "{testimonial.quote}"
              </Text>

              {/* Author */}
              <div className="flex items-center justify-between">
                <Text className="font-medium text-neutral-900">
                  {testimonial.author}
                </Text>
                {testimonial.verified && (
                  <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Instagram Section */}
        <div className="mt-16 text-center">
          <Text className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-500">
            Follow us on Instagram
          </Text>
          <Heading level="h3" className="mb-6 text-2xl font-bold text-neutral-900">
            @yourstore
          </Heading>
          <div className="grid grid-cols-3 gap-2 small:grid-cols-6 small:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200"
              >
                {/* Placeholder for Instagram images */}
                <div className="flex h-full w-full items-center justify-center">
                  <svg
                    className="h-8 w-8 text-neutral-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialProof
