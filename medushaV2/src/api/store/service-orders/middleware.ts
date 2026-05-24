import { authenticate } from "@medusajs/framework/http"

export const config = {
  routes: [
    {
      matcher: "/store/service-orders/*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
}
