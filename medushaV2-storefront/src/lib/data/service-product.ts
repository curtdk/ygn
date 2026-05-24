"use server"

import { HttpTypes } from "@medusajs/types"
import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export async function getServiceProducts() {
  const headers = await getAuthHeaders()
  
  const response = await sdk.client.fetch("/store/service-products", {
    headers,
  })
  
  return response as { service_products: any[] }
}

export async function getServiceProduct(id: string) {
  const headers = await getAuthHeaders()
  
  const response = await sdk.client.fetch(`/store/service-products/${id}`, {
    headers,
  })
  
  return response as { service_product: any }
}

export async function createServiceOrder(data: {
  order_id: string
  service_product_id: string
  requirements?: any
}) {
  const headers = await getAuthHeaders()
  
  const response = await sdk.client.fetch("/store/service-orders", {
    method: "POST",
    headers,
    body: data,
  })
  
  return response as { order: any }
}

export async function getCustomerOrders() {
  const headers = await getAuthHeaders()
  
  const response = await sdk.client.fetch("/store/service-orders", {
    headers,
  })
  
  return response as { orders: any[] }
}

export async function getServiceOrder(id: string) {
  const headers = await getAuthHeaders()
  
  const response = await sdk.client.fetch(`/store/service-orders/${id}`, {
    headers,
  })
  
  return response as { order: any }
}

export async function acceptServiceOrder(id: string) {
  const headers = await getAuthHeaders()
  
  const response = await sdk.client.fetch(`/store/service-orders/${id}`, {
    method: "POST",
    headers,
    body: { action: "accept" },
  })
  
  return response as { order: any }
}

export async function completeServiceOrder(id: string, resultUrl: string, resultThumbnail?: string) {
  const headers = await getAuthHeaders()
  
  const response = await sdk.client.fetch(`/store/service-orders/${id}`, {
    method: "POST",
    headers,
    body: { action: "complete", result_url: resultUrl, result_thumbnail: resultThumbnail },
  })
  
  return response as { order: any }
}

export async function cancelServiceOrder(id: string) {
  const headers = await getAuthHeaders()
  
  const response = await sdk.client.fetch(`/store/service-orders/${id}`, {
    method: "POST",
    headers,
    body: { action: "cancel" },
  })
  
  return response as { order: any }
}

export async function getProviderOrders() {
  const headers = await getAuthHeaders()
  
  const response = await sdk.client.fetch("/store/service-orders/provider", {
    headers,
  })
  
  return response as { orders: any[] }
}