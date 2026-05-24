import { authenticate } from "@medusajs/framework/http"

export const config = {
  routes: [
    {
      matcher: "/store/team/*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
}
