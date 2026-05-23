import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationTypes } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Get the publishable key from the header
  const publishableKey = req.headers["x-publishable-api-key"] as string

  if (!publishableKey) {
    return res.status(401).json({
      type: "not_allowed",
      message: "Publishable API key required in the request header: x-publishable-api-key. You can manage your keys in settings in the dashboard.",
    })
  }

  // Return available locales
  // You can customize this list based on your requirements
  const locales = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文" },
  ]

  return res.status(200).json({ locales })
}