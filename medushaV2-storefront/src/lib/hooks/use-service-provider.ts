"use client"

import { useEffect, useState } from "react"
import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"

export function useServiceProviderApplication() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = async () => {
    setIsLoading(true)
    try {
      const headers = await getAuthHeaders()
      const response = await sdk.client.fetch("/store/service-providers/status", { headers })
      setData(response)
      setError(null)
    } catch (err: any) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  return { data, isLoading, error, refetch }
}