import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PROVIDER_MODULE } from "../../../modules/service-provider"

function extractCustomerId(req: MedusaRequest): string | null {
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7)
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
      return payload.actor_id || payload.customer_id || payload.app_metadata?.customer_id || null
    } catch {}
  }
  return null
}

interface TeamMember {
  id: string
  customer_id: string
  level: number
  created_at: Date
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const loggedInUserId = (req as any).auth?.customer?.id || extractCustomerId(req)

  if (!loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const serviceProviderService = req.scope.resolve(SERVICE_PROVIDER_MODULE)
    
    // Get all referrals where this user is the referrer (they invited others)
    const referrals = await serviceProviderService.listCustomerReferrals({
      referrer_id: loggedInUserId,
    })

    // Group by level
    const level1: TeamMember[] = []
    const level2: TeamMember[] = []
    const level3: TeamMember[] = []

    for (const referral of referrals) {
      const refereeId = referral.referee_id || referral.customer_id
      if (!refereeId) continue
      
      const member: TeamMember = {
        id: referral.id,
        customer_id: refereeId,
        level: referral.level || 1,
        created_at: referral.created_at,
      }

      if (member.level === 1) {
        level1.push(member)
      } else if (member.level === 2) {
        level2.push(member)
      } else if (member.level === 3) {
        level3.push(member)
      }
    }

    res.json({
      level1,
      level2,
      level3,
      summary: {
        total: level1.length + level2.length + level3.length,
        level1_count: level1.length,
        level2_count: level2.length,
        level3_count: level3.length,
      },
    })
  } catch (error) {
    console.error("Error fetching team data:", error)
    res.status(500).json({ error: "Failed to fetch team data" })
  }
}