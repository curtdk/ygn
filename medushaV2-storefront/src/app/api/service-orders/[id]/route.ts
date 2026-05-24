import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const headers = await getAuthHeaders()
    const body = await request.json()
    const response = await sdk.client.fetch(`/store/service-orders/${id}`, {
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
