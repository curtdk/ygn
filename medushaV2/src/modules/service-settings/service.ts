import { MedusaService } from "@medusajs/framework/utils"
import ServiceSetting from "./models/service-setting"

const DEFAULT_SETTINGS: Record<string, string> = {
  order_review_mode: "auto",
  order_dispatch_mode: "grab",
  commission_settlement_mode: "auto",
  auto_complete_hours: "72",
  profit_sharing_level1_enabled: "true",
  profit_sharing_level2_enabled: "true",
  profit_sharing_level3_enabled: "true",
  default_commission_rate: "0.10",
  platform_fee_rate: "0.05",
}

class ServiceSettingsService extends MedusaService({ ServiceSetting }) {
  async getAllSettings(): Promise<Record<string, any>> {
    const settings = await this.listServiceSettings({})
    const result: Record<string, any> = { ...DEFAULT_SETTINGS }
    for (const s of settings) {
      result[s.key] = this.parseValue(s.value)
    }
    return result
  }

  async getSetting(key: string): Promise<any> {
    const settings = await this.listServiceSettings({ key })
    if (settings.length > 0) {
      return this.parseValue(settings[0].value)
    }
    return this.parseValue(DEFAULT_SETTINGS[key])
  }

  async updateSettings(updates: Record<string, any>): Promise<Record<string, any>> {
    for (const [key, value] of Object.entries(updates)) {
      await this.upsertSetting(key, value)
    }
    return this.getAllSettings()
  }

  async setSetting(key: string, value: any): Promise<any> {
    await this.upsertSetting(key, value)
    return value
  }

  private async upsertSetting(key: string, value: any): Promise<void> {
    const strValue = String(value)
    const existing = await this.listServiceSettings({ key })
    if (existing.length > 0) {
      await this.updateServiceSettings({ id: existing[0].id, value: strValue })
    } else {
      await this.createServiceSettings({ key, value: strValue })
    }
  }

  private parseValue(value: string | undefined): any {
    if (value === undefined || value === null) return null
    if (value === "true") return true
    if (value === "false") return false
    const num = Number(value)
    if (!isNaN(num) && value.trim() !== "") return num
    return value
  }
}

export default ServiceSettingsService
