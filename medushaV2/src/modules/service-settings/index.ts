import { Module } from "@medusajs/framework/utils"
import ServiceSettingsService from "./service"

export const SERVICE_SETTINGS_MODULE = "serviceSettingsModule"

export default Module(SERVICE_SETTINGS_MODULE, {
  service: ServiceSettingsService,
})

export { ServiceSettingsService }
