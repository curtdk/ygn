import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SERVICE_SETTINGS_MODULE } from "../../../modules/service-settings"
import ServiceSettingsService from "../../../modules/service-settings/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service = req.scope.resolve<ServiceSettingsService>(SERVICE_SETTINGS_MODULE)
  const settings = await service.getAllSettings()
  res.json({ settings })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const service = req.scope.resolve<ServiceSettingsService>(SERVICE_SETTINGS_MODULE)
  const body = req.body as any

  if (body.updates) {
    const updated = await service.updateSettings(body.updates)
    return res.json({ settings: updated, message: "Settings updated successfully" })
  }

  if (body.key && body.value !== undefined) {
    const updated = await service.setSetting(body.key, body.value)
    return res.json({ key: body.key, value: updated, message: "Setting updated successfully" })
  }

  return res.status(400).json({
    error: "Invalid request. Provide either 'updates' object or 'key' and 'value'",
  })
}
