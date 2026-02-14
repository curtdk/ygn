import {
  createWorkflow,
  WorkflowResponse
} from "@medusajs/framework/workflows-sdk"
import { processVideoFaceReplacementStep } from "./steps/process-video-face-replacement"

type GenerateVideoInput = {
  user_video_id: string
}

export const generateVideoWorkflow = createWorkflow(
  "generate-video",
  (input: GenerateVideoInput) => {
    // 处理视频人脸替换
    const result = processVideoFaceReplacementStep(input)

    return new WorkflowResponse({
      success: true,
      video_url: result.video_url
    })
  }
)
