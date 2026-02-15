import { authenticate } from "@medusajs/framework/http"

export const config = {
  routes: [
    {
      matcher: "/store/user/*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
}
