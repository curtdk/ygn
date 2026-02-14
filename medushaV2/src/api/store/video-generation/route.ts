import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { USER_VIDEO_MODULE } from "../../../modules/user-video"
import { generateVideoWorkflow } from "../../../workflows/generate-video"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
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

    console.log('收到视频生成请求:', { product_id, title, materials_used })

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

    console.log('用户视频记录已创建:', userVideo.id)

    // 5. 异步触发视频生成工作流
    generateVideoWorkflow(req.scope)
      .run({
        input: {
          user_video_id: userVideo.id
        }
      })
      .then(() => {
        console.log('视频生成工作流完成:', userVideo.id)
      })
      .catch((error) => {
        console.error('视频生成工作流失败:', error)
        console.error('错误堆栈:', error.stack)
      })

    res.json({
      video: userVideo,
      message: "视频生成任务已创建，正在处理中..."
    })
  } catch (error: any) {
    console.error('视频生成API错误:', error)
    console.error('错误堆栈:', error.stack)

    res.status(500).json({
      code: "video_generation_error",
      type: "video_generation_error",
      message: error.message || "视频生成任务创建失败"
    })
  }
}
