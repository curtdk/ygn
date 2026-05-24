import { NextResponse } from "next/server"
import { applyServiceProvider } from "@lib/data/service-provider"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await applyServiceProvider(body)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}