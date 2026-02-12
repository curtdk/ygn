import { MedusaService } from "@medusajs/framework/utils"
import UserVideo from "./models/user-video"

class UserVideoModuleService extends MedusaService({
  UserVideo,
}) {}

export default UserVideoModuleService
