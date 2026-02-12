import { MedusaService } from "@medusajs/framework/utils"
import VideoMaterial from "./models/video-material"

class VideoMaterialModuleService extends MedusaService({
  VideoMaterial,
}) {}

export default VideoMaterialModuleService
