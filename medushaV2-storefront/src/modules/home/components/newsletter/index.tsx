"use client"

import { Button, Heading, Input, Text } from "@medusajs/ui"
import { useState } from "react"

const Newsletter = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    // Simulate API call
    setTimeout(() => {
      setStatus("success")
      setEmail("")
      setTimeout(() => setStatus("idle"), 3000)
    }, 1000)
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-16 small:py-24">
      <div className="content-container">
        <div className="mx-auto max-w-3xl text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <Heading
            level="h2"
            className="mb-4 text-3xl font-bold text-neutral-900 small:text-4xl"
          >
            Join Our Community
          </Heading>

          <Text className="mb-8 text-lg text-neutral-600">
            Subscribe to our newsletter for exclusive offers, style tips, and early access to new collections.
            <br className="hidden small:block" />
            Plus, get <span className="font-semibold text-neutral-900">15% off</span> your first order.
          </Text>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mx-auto flex max-w-md flex-col gap-3 small:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
                disabled={status === "loading" || status === "success"}
              />
              <Button
                type="submit"
                size="large"
                disabled={status === "loading" || status === "success"}
                className="bg-neutral-900 hover:bg-neutral-800"
              >
                {status === "loading" && "Subscribing..."}
                {status === "success" && "Subscribed!"}
                {status === "idle" && "Subscribe"}
                {status === "error" && "Try Again"}
              </Button>
            </div>
          </form>

          {/* Success Message */}
          {status === "success" && (
            <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
              Thank you for subscribing! Check your inbox for your welcome discount.
            </div>
          )}

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              No spam, ever
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Privacy protected
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Unsubscribe anytime
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Newsletter
