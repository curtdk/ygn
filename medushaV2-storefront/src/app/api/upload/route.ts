import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const headers = await getAuthHeaders()

    const response = await sdk.client.fetch("/admin/upload", {
      method: "POST",
      headers: {
        ...headers,
      },
      body: formData,
    })

    return NextResponse.json(response)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
