import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import ServicePaymentWrapper from "@modules/service/components/payment-wrapper"
import ServiceCheckoutForm from "@modules/service/templates/checkout-form"
import ServiceCheckoutSummary from "@modules/service/templates/checkout-summary"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Service Checkout",
}

export default async function ServiceCheckout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_416px] content-container gap-x-40 py-12">
      <ServicePaymentWrapper cart={cart}>
        <ServiceCheckoutForm cart={cart} customer={customer} />
      </ServicePaymentWrapper>
      <ServiceCheckoutSummary cart={cart} />
    </div>
  )
}