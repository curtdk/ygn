import ServiceProductModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const SERVICE_PRODUCT_MODULE = "serviceProductModule"

export default Module(SERVICE_PRODUCT_MODULE, {
  service: ServiceProductModuleService,
})