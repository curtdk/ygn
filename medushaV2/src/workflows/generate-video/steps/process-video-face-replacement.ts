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

      // 暂时使用测试URL（等本地文件上传到远程后再改回来）
      const TEST_SOURCE_VIDEO = 'http://viapi-test.oss-cn-shanghai.aliyuncs.com/viapi-3.0domepic/videoenhan/MergeVideoFace/MergeVideoFace2.mp4'
      const TEST_TEMPLATE_FACE = 'http://viapi-test.oss-cn-shanghai.aliyuncs.com/viapi-3.0domepic/videoenhan/MergeVideoFace/MergeVideoFace-fm2.jpg'
      const TEST_REPLACEMENT_FACE = 'http://viapi-test.oss-cn-shanghai.aliyuncs.com/viapi-3.0domepic/imageenhan/MakeSuperResolutionImage/MakeSuperResolutionImage10.png'

      console.log('使用测试URL进行人脸替换')

      const mergeInfos = [{
        imageUrl: TEST_REPLACEMENT_FACE,
        templateFaceUrl: TEST_TEMPLATE_FACE
      }]

      console.log('找到需要替换的人脸数量:', mergeInfos.length)

      // 7. 调用阿里云视频人脸替换服务
      const aliyunService = new AliyunVideoFaceService()

      // 7.1 创建模板
      console.log('创建视频模板...')
      const templateId = await aliyunService.createFaceVideoTemplate(TEST_SOURCE_VIDEO)

      // 7.2 合并视频人脸
      console.log('开始人脸替换...')
      const jobId = await aliyunService.mergeVideoModelFace({
        templateId,
        enhance: true,
        mergeInfos
      })

      // 7.3 轮询结果
      console.log('等待处理完成...')
      const result = await aliyunService.pollJobResult(jobId, {
        maxAttempts: 120, // 10分钟
        interval: 5000
      })

      if (!result.videoUrl) {
        throw new Error('视频生成失败：未获取到视频URL')
      }

      // 7.4 下载视频到系统临时目录（避免触发文件监视器重启）
      console.log('下载生成的视频...')
      const timestamp = Date.now()
      const tempDir = os.tmpdir()
      const tempPath = path.join(tempDir, `medusa-video-${timestamp}-${input.user_video_id}.mp4`)

      await aliyunService.downloadVideo(result.videoUrl, tempPath)

      // 7.5 上传到 OSS
      console.log('上传视频到 OSS...')
      const { Modules } = await import('@medusajs/framework/utils')
      const fileService = container.resolve(Modules.FILE)
      const fileBuffer = fs.readFileSync(tempPath)
      const uploadedFiles = await fileService.createFiles([{
        filename: `video-${input.user_video_id}-${timestamp}.mp4`,
        mimeType: 'video/mp4',
        content: fileBuffer.toString('base64'),
      }])

      const publicUrl = uploadedFiles[0].url

      // 7.6 删除临时文件
      console.log('删除临时文件...')
      fs.unlinkSync(tempPath)

      // 7.7 清理模板
      console.log('清理模板...')
      await aliyunService.deleteFaceVideoTemplate(templateId)

      // 8. 更新用户视频记录
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
