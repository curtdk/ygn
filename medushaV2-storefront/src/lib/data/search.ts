"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion } from "./regions"

export type SearchParams = {
  q: string
  limit?: number
  offset?: number
  countryCode: string
  sortBy?: "relevance" | "price_asc" | "price_desc" | "created_at"
  minPrice?: number
  maxPrice?: number
  collectionId?: string
  categoryId?: string
}

export type SearchResponse = {
  products: HttpTypes.StoreProduct[]
  count: number
  query: string
}

/**
 * Search products using Meilisearch
 */
export async function searchProducts(
  params: SearchParams
): Promise<SearchResponse> {
  const {
    q,
    limit = 20,
    offset = 0,
    countryCode,
    sortBy = "relevance",
    minPrice,
    maxPrice,
    collectionId,
    categoryId,
  } = params

  if (!q || q.trim().length === 0) {
    return {
      products: [],
      count: 0,
      query: q,
    }
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return {
      products: [],
      count: 0,
      query: q,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = await getCacheOptions("products")

  try {
    // Build query params for search
    const queryParams: any = {
      q: q.trim(),
      limit,
      offset,
      region_id: region.id,
      fields: "*variants,*variants.calculated_price",
    }

    // Add filters
    const filters: string[] = []

    if (minPrice !== undefined && maxPrice !== undefined) {
      filters.push(`variants.calculated_price.calculated_amount >= ${minPrice}`)
      filters.push(`variants.calculated_price.calculated_amount <= ${maxPrice}`)
    } else if (minPrice !== undefined) {
      filters.push(`variants.calculated_price.calculated_amount >= ${minPrice}`)
    } else if (maxPrice !== undefined) {
      filters.push(`variants.calculated_price.calculated_amount <= ${maxPrice}`)
    }

    if (collectionId) {
      filters.push(`collection_id = "${collectionId}"`)
    }

    if (categoryId) {
      filters.push(`category_id = "${categoryId}"`)
    }

    if (filters.length > 0) {
      queryParams.filter = filters
    }

    // Add sorting
    if (sortBy === "price_asc") {
      queryParams.order = "variants.calculated_price.calculated_amount:asc"
    } else if (sortBy === "price_desc") {
      queryParams.order = "variants.calculated_price.calculated_amount:desc"
    } else if (sortBy === "created_at") {
      queryParams.order = "created_at:desc"
    }

    // Perform search via Medusa Store API
    const response = await sdk.store.product.list(queryParams, headers, next)

    return {
      products: response.products || [],
      count: response.count || 0,
      query: q,
    }
  } catch (error) {
    console.error("Search error:", error)
    return {
      products: [],
      count: 0,
      query: q,
    }
  }
}

/**
 * Get search suggestions (autocomplete)
 */
export async function getSearchSuggestions(
  query: string,
  countryCode: string,
  limit: number = 5
): Promise<HttpTypes.StoreProduct[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  const result = await searchProducts({
    q: query,
    limit,
    countryCode,
  })

  return result.products
}
