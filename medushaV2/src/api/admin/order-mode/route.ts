import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

interface OrderModeBody {
  mode?: "grab" | "assigned"
  enabled?: boolean
  auto_assign?: boolean
}

// Simple key-value store for order mode settings
// In production, this should be stored in a database or config file
let orderModeSettings = {
  mode: "grab" as "grab" | "assigned", // "grab" = 抢单模式, "assigned" = 派单模式
  enabled: true,
  auto_assign: false,
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.json({ 
    settings: orderModeSettings 
  })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const body = req.body as OrderModeBody
  const { mode, enabled, auto_assign } = body

  if (mode && !["grab", "assigned"].includes(mode)) {
    return res.status(400).json({ 
      error: "mode must be 'grab' or 'assigned'" 
    })
  }

  if (mode !== undefined) {
    orderModeSettings.mode = mode
  }

  if (enabled !== undefined) {
    orderModeSettings.enabled = Boolean(enabled)
  }

  if (auto_assign !== undefined) {
    orderModeSettings.auto_assign = Boolean(auto_assign)
  }

  res.json({ 
    settings: orderModeSettings,
    message: "Settings updated successfully"
  })
}