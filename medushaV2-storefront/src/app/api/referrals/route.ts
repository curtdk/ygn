import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"

export async function GET() {
  try {
    const headers = await getAuthHeaders()
    const response = await sdk.client.fetch("/store/referrals", { headers })
    return NextResponse.json(response)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const headers = await getAuthHeaders()
    const body = await request.json()
    const response = await sdk.client.fetch("/store/referrals", {
      method: "POST",
      headers,
      body,
    })
    return NextResponse.json(response)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
