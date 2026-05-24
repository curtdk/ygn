import { authenticate } from "@medusajs/framework/http"

export const config = {
  routes: [
    {
      matcher: "/store/referrals/*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
}
