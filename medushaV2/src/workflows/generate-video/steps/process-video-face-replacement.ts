import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { AliyunVideoFaceService } from "../../../services/aliyun-video-face"
import { USER_VIDEO_MODULE } from "../../../modules/user-video"
import { VIDEO_MATERIAL_MODULE } from "../../../modules/video-material"
import * as path from "path"
import * as fs from "fs"
import * as os from "os"

type ProcessVideoInput = {
  user_video_id: string
}

export const processVideoFaceReplacementStep = createStep(
  "process-video-face-replacement",
  async (input: ProcessVideoInput, { container }) => {
    const userVideoService = container.resolve(USER_VIDEO_MODULE)

    console.log('开始处理视频人脸替换，user_video_id:', input.user_video_id)

    try {
      // 1. 获取用户视频记录
      const userVideo = await userVideoService.retrieveUserVideo(input.user_video_id)

      if (!userVideo) {
        throw new Error('用户视频记录不存在')
      }

      // 2. 更新状态为处理中
      // @ts-expect-error - TypeScript suggests updateUserVideoes but runtime uses updateUserVideos
      await userVideoService.updateUserVideos({
        selector: { id: input.user_video_id },
        data: {
          status: "processing"
        }
      })

      // 3. 从 materials_used 中提取视频和图片 URL
      const materialsUsed = userVideo.materials_used as Record<string, any>

      // 3.1 获取源视频 URL
      const sourceVideoMaterial = materialsUsed.shipin
      if (!sourceVideoMaterial || !sourceVideoMaterial.original_url) {
        throw new Error('未找到源视频')
      }
      const sourceVideoUrl = decodeURIComponent(sourceVideoMaterial.original_url)
      console.log('源视频 URL:', sourceVideoUrl)

      // 3.2 获取所有需要替换的人脸
      const mergeInfos = Object.entries(materialsUsed)
        .filter(([key, material]: [string, any]) =>
          material.type === 'image' && material.replaced_url
        )
        .map(([key, material]: [string, any]) => ({
          templateFaceUrl: decodeURIComponent(material.original_url),
          imageUrl: decodeURIComponent(material.replaced_url)
        }))

      if (mergeInfos.length === 0) {
        throw new Error('没有找到需要替换的人脸')
      }

      console.log('找到需要替换的人脸数量:', mergeInfos.length)
      console.log('人脸替换信息:', JSON.stringify(mergeInfos, null, 2))

      // 4. 调用阿里云视频人脸替换服务
      const aliyunService = new AliyunVideoFaceService()

      // 4.1 创建模板
      console.log('创建视频模板...')
      const templateId = await aliyunService.createFaceVideoTemplate(sourceVideoUrl)

      // 4.2 合并视频人脸
      console.log('开始人脸替换...')
      const jobId = await aliyunService.mergeVideoModelFace({
        templateId,
        enhance: true,
        mergeInfos
      })

      // 4.3 轮询结果
      console.log('等待处理完成...')
      const result = await aliyunService.pollJobResult(jobId, {
        maxAttempts: 120, // 10分钟
        interval: 5000
      })

      if (!result.videoUrl) {
        throw new Error('视频生成失败：未获取到视频URL')
      }

      // 5. 下载视频到系统临时目录（避免触发文件监视器重启）
      console.log('下载生成的视频...')
      const timestamp = Date.now()
      const tempDir = os.tmpdir()
      const tempPath = path.join(tempDir, `medusa-video-${timestamp}-${input.user_video_id}.mp4`)

      await aliyunService.downloadVideo(result.videoUrl, tempPath)

      // 6. 上传到 OSS
      console.log('上传视频到 OSS...')
      const { Modules } = await import('@medusajs/framework/utils')
      const fileService = container.resolve(Modules.FILE)
      const fileBuffer = fs.readFileSync(tempPath)
      const uploadedFiles = await fileService.createFiles([{
        filename: `video-${input.user_video_id}-${timestamp}.mp4`,
        mimeType: 'video/mp4',
        content: fileBuffer.toString('base64'),
        access: "public" as const,
      }])

      const publicUrl = uploadedFiles[0].url

      // 7. 删除临时文件
      console.log('删除临时文件...')
      fs.unlinkSync(tempPath)

      // 8. 清理模板
      console.log('清理模板...')
      await aliyunService.deleteFaceVideoTemplate(templateId)

      // 9. 更新用户视频记录
      // @ts-expect-error - TypeScript suggests updateUserVideoes but runtime uses updateUserVideos
      await userVideoService.updateUserVideos({
        selector: { id: input.user_video_id },
        data: {
          status: "completed",
          video_url: publicUrl
        }
      })

      console.log('视频处理完成:', publicUrl)

      return new StepResponse({
        success: true,
        video_url: publicUrl
      })
    } catch (error: any) {
      console.error('视频处理失败:', error.message)

      // 更新状态为失败
      // @ts-expect-error - TypeScript suggests updateUserVideoes but runtime uses updateUserVideos
      await userVideoService.updateUserVideos({
        selector: { id: input.user_video_id },
        data: {
          status: "failed",
          error_message: error.message
        }
      })

      throw error
    }
  }
)
