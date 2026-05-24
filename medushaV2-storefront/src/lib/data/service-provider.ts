"use server"

import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"
import medusaError from "@lib/util/medusa-error"
import { revalidateTag } from "next/cache"

export async function getServiceProviderStatus() {
  const headers = await getAuthHeaders()

  return sdk.client.fetch("/store/service-providers/status", {
    headers,
  })
  .catch(medusaError)
}

export async function applyServiceProvider(data: {
  phone: string
  id_card_front: string
  id_card_back: string
  work_certificate?: string
  honor_certificate?: string
}) {
  const headers = await getAuthHeaders()

  return sdk.client.fetch("/store/service-providers", {
    method: "POST",
    headers,
    body: data,
  })
  .then((res) => {
    revalidateTag("service-providers")
    return res
  })
  .catch(medusaError)
}

export async function getReferralInfo() {
  const headers = await getAuthHeaders()

  return sdk.client.fetch("/store/referrals", {
    headers,
  })
  .catch(medusaError)
}

export async function bindReferralCode(referral_code: string) {
  const headers = await getAuthHeaders()

  return sdk.client.fetch("/store/referrals", {
    method: "POST",
    headers,
    body: { referral_code },
  })
  .then((res) => {
    revalidateTag("referrals")
    return res
  })
  .catch(medusaError)
}