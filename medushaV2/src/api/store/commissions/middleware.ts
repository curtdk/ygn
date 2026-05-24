import { authenticate } from "@medusajs/framework/http"

export const config = {
  routes: [
    {
      matcher: "/store/commissions/*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
}
