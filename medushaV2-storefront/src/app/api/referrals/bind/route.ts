import { NextResponse } from "next/server"
import { bindReferralCode } from "@lib/data/service-provider"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await bindReferralCode(body.referral_code)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}