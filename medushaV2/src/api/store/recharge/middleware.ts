import { authenticate } from "@medusajs/framework/http"

export const config = {
  routes: [
    {
      matcher: "/store/recharge/*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
}
