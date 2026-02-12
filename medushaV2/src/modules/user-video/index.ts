import UserVideoModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const USER_VIDEO_MODULE = "userVideoModuleService"

export default Module(USER_VIDEO_MODULE, {
  service: UserVideoModuleService,
})
