import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_PROVIDER_MODULE } from "../../../modules/service-provider"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const serviceProviderService = req.scope.resolve(SERVICE_PROVIDER_MODULE)
  const loggedInUserId = (req as any).auth?.customer?.id

  if (!loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  // Get referral code for current user
  const referrals = await serviceProviderService.listCustomerReferrals({
    customer_id: loggedInUserId,
  })

  const referralCode = referrals[0]?.referral_code || await serviceProviderService.generateReferralCode()

  // Save referral code if not exists
  if (!referrals[0]) {
    await serviceProviderService.createCustomerReferrals({
      customer_id: loggedInUserId,
      referral_code: referralCode,
    })
  }

  // Get my referrals (people I invited)
  const myReferrals = await serviceProviderService.listCustomerReferrals({
    referrer_id: loggedInUserId,
  })

  // Get my referrer (who invited me)
  const myReferrer = await serviceProviderService.listCustomerReferrals({
    customer_id: loggedInUserId,
  })

  res.json({
    referral_code: referralCode,
    referrals_count: myReferrals.length,
    referrer: myReferrer[0]?.referrer_id || null,
  })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const serviceProviderService = req.scope.resolve(SERVICE_PROVIDER_MODULE)
  const loggedInUserId = (req as any).auth?.customer?.id

  if (!loggedInUserId) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const { referral_code } = req.body

  if (!referral_code) {
    return res.status(400).json({ error: "Referral code is required" })
  }

  // Check if user already has a referrer
  const existing = await serviceProviderService.listCustomerReferrals({
    customer_id: loggedInUserId,
  })

  if (existing[0]?.referrer_id) {
    return res.status(400).json({ error: "You already have a referrer" })
  }

  // Find referrer by code
  const allReferrals = await serviceProviderService.listCustomerReferrals({
    referral_code,
  })

  if (allReferrals.length === 0) {
    return res.status(404).json({ error: "Invalid referral code" })
  }

  const referrer = allReferrals[0]

  // Create referral relationship with chain
  // Level 1: Direct referrer
  await serviceProviderService.createCustomerReferrals({
    customer_id: loggedInUserId,
    referrer_id: referrer.customer_id,
    level: 1,
    referral_code: await serviceProviderService.generateReferralCode(),
  })

  // Level 2 & 3: Follow the referrer's chain
  const referrerChain = await serviceProviderService.getReferralChain(referrer.customer_id, 3)

  for (const item of referrerChain) {
    await serviceProviderService.createCustomerReferrals({
      customer_id: loggedInUserId,
      referrer_id: item.referrer_id,
      level: item.level + 1,
      referral_code: null, // Only level 1 has the code
    })
  }

  res.json({ success: true })
}