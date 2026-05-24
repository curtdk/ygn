import { authenticate } from "@medusajs/framework/http"

export const config = {
  routes: [
    {
      matcher: "/store/earnings/*",
      middlewares: [authenticate("customer", ["session", "bearer"])],
    },
  ],
}
