"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export async function getCommissions() {
  const headers = await getAuthHeaders()
  
  const response = await sdk.client.fetch("/store/commissions", {
    headers,
  })
  
  return response as { commissions: any[] }
}

export async function getCommissionSummary() {
  const headers = await getAuthHeaders()
  
  const response = await sdk.client.fetch("/store/commissions/summary", {
    headers,
  })
  
  return response as { summary: any }
}

export async function getEarnings() {
  const headers = await getAuthHeaders()
  
  const response = await sdk.client.fetch("/store/earnings", {
    headers,
  })
  
  return response as { earnings: any[] }
}

export async function getEarningsSummary() {
  const headers = await getAuthHeaders()
  
  const response = await sdk.client.fetch("/store/earnings/summary", {
    headers,
  })
  
  return response as { summary: any }
}