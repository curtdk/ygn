import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // Get auth headers from request
    const publishableKey = req.headers["x-publishable-api-key"] as string

    if (!publishableKey) {
      return res.status(400).json({
        error: "Missing publishable API key",
      })
    }

    // Fetch all published products using native fetch
    const baseUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    const url = new URL(`${baseUrl}/store/products`)
    url.searchParams.set("limit", "100")
    url.searchParams.set("fields", "id,title,description,thumbnail,handle,status,metadata")

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-publishable-api-key": publishableKey,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`)
    }

    const data = await response.json()

    // Filter for service products (metadata.is_service = true)
    const allProducts = data.products || []
    const serviceProducts = allProducts.filter((product: any) => {
      return product.metadata?.is_service === true
    })

    res.json({
      service_products: serviceProducts,
      count: serviceProducts.length,
    })
  } catch (error: any) {
    console.error("Service products error:", error)
    res.status(500).json({
      error: "Failed to fetch service products",
      message: error.message,
    })
  }
}