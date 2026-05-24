import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Shared order mode settings (in production, read from database or config)
const orderModeSettings = {
  mode: "grab" as "grab" | "assigned",
  enabled: true,
  auto_assign: false,
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.json({ 
    mode: orderModeSettings.mode,
    enabled: orderModeSettings.enabled,
    auto_assign: orderModeSettings.auto_assign,
    description: orderModeSettings.mode === "grab" 
      ? "抢单模式：服务商可自由接单" 
      : "派单模式：订单由平台分配"
  })
}