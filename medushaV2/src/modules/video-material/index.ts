import VideoMaterialModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const VIDEO_MATERIAL_MODULE = "videoMaterialModuleService"

export default Module(VIDEO_MATERIAL_MODULE, {
  service: VideoMaterialModuleService,
})
