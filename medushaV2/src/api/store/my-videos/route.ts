import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { USER_VIDEO_MODULE } from "../../../modules/user-video"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const userVideoService = req.scope.resolve(USER_VIDEO_MODULE)
  const userId = (req as any).auth?.actor_id || "guest"

  const videos = await userVideoService.listUserVideoes({
    user_id: userId,
  }, {
    order: { created_at: "DESC" }
  })

  res.json({ videos })
}
