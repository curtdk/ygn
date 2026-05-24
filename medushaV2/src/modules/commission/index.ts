import CommissionModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const COMMISSION_MODULE = "commissionModule"

export default Module(COMMISSION_MODULE, {
  service: CommissionModuleService,
})