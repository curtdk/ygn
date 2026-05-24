import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import ServiceAddresses from "@modules/service/components/addresses"
import ServicePayment from "@modules/service/components/payment"
import ServiceReview from "@modules/service/components/review"
import ServiceShipping from "@modules/service/components/shipping"

export default async function ServiceCheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <ServiceAddresses cart={cart} customer={customer} />

      <ServiceShipping cart={cart} availableShippingMethods={shippingMethods} />

      <ServicePayment cart={cart} availablePaymentMethods={paymentMethods} />

      <ServiceReview cart={cart} />
    </div>
  )
}