import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { USER_VIDEO_MODULE } from "../../../modules/user-video"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const userVideoService = req.scope.resolve(USER_VIDEO_MODULE)
  const body = req.body as {
    product_id: string
    materials_used: Record<string, any>
    title: string
  }

  const {
    product_id,
    materials_used,
    title
  } = body

  // TODO: 1. 验证用户积分
  // TODO: 2. 创建订单
  // TODO: 3. 扣除积分

  // 4. 创建视频生成记录
  const userVideo = await userVideoService.createUserVideoes({
    user_id: (req as any).auth?.actor_id || "guest",
    product_id,
    title,
    materials_used,
    status: "pending",
  })

  // TODO: 5. 触发视频生成工作流
  // await triggerVideoGenerationWorkflow(userVideo.id)

  res.json({
    video: userVideo,
    message: "视频生成任务已创建"
  })
}
