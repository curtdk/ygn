import { NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"

export async function GET() {
  try {
    const headers = await getAuthHeaders()
    const response = await sdk.client.fetch("/store/service-orders/provider", { headers })
    return NextResponse.json(response)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
