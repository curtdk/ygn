import { authenticate } from "@medusajs/framework/http"

export const config = {
  routes: [
    {
      matcher: "/store/service-providers",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
    {
      matcher: "/store/service-providers/status",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
}
