import ServiceProviderModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const SERVICE_PROVIDER_MODULE = "serviceProviderModule"

export default Module(SERVICE_PROVIDER_MODULE, {
  service: ServiceProviderModuleService,
})