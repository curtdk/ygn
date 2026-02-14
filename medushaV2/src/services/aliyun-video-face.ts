import videoenhan20200320, * as $videoenhan from '@alicloud/videoenhan20200320'
import OpenApiClient, * as OpenApi from '@alicloud/openapi-client'
import * as $Util from '@alicloud/tea-util'
import Credential from '@alicloud/credentials'
import * as fs from 'fs'
import * as path from 'path'

interface AliyunVideoFaceConfig {
  accessKeyId: string
  accessKeySecret: string
  endpoint: string
}

interface MergeVideoFaceParams {
  templateId: string
  enhance?: boolean
  mergeInfos: Array<{
    imageUrl: string
    templateFaceUrl: string
  }>
}

interface JobResult {
  status: 'SUCCESS' | 'FAILED' | 'PROCESSING'
  videoUrl?: string
  errorMessage?: string
  data?: any
}

interface PollOptions {
  maxAttempts?: number
  interval?: number
}

export class AliyunVideoFaceService {
  private config: AliyunVideoFaceConfig
  private client: videoenhan20200320

  constructor() {
    // Load configuration from environment variables
    this.config = {
      accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID || '',
      accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET || '',
      endpoint: process.env.ALIYUN_VIDEOENHAN_ENDPOINT || 'videoenhan.cn-shanghai.aliyuncs.com'
    }

    if (!this.config.accessKeyId || !this.config.accessKeySecret) {
      throw new Error('Aliyun credentials not configured. Please set ALIYUN_ACCESS_KEY_ID and ALIYUN_ACCESS_KEY_SECRET in .env')
    }

    this.client = this.createClient()
  }

  private createClient(): videoenhan20200320 {
    const config = new OpenApi.Config({
      accessKeyId: this.config.accessKeyId,
      accessKeySecret: this.config.accessKeySecret,
    })
    config.endpoint = this.config.endpoint
    return new videoenhan20200320(config)
  }

  async createFaceVideoTemplate(videoUrl: string): Promise<string> {
    try {
      console.log('Creating face video template from:', videoUrl)

      const request = new $videoenhan.AddFaceVideoTemplateRequest({
        videoURL: videoUrl
      })
      const runtime = new $Util.RuntimeOptions({})

      const response = await this.client.addFaceVideoTemplateWithOptions(request, runtime)

      // AddFaceVideoTemplate is async, returns requestId as jobId
      const jobId = response.body?.requestId
      if (!jobId) {
        throw new Error('Failed to create template: No requestId returned')
      }

      console.log('Template creation job started:', jobId)
      console.log('Polling for template creation result...')

      // Poll for the template creation result
      const result = await this.pollJobResult(jobId, {
        maxAttempts: 60,
        interval: 5000
      })

      if (!result.data?.templateId) {
        throw new Error('Failed to create template: No templateId in result')
      }

      console.log('Template created successfully:', result.data.templateId)
      return result.data.templateId
    } catch (error: any) {
      console.error('Error creating face video template:', error.message)
      if (error.data?.Recommend) {
        console.error('Diagnostic URL:', error.data.Recommend)
      }
      throw new Error(`Failed to create face video template: ${error.message}`)
    }
  }

  async mergeVideoModelFace(params: MergeVideoFaceParams): Promise<string> {
    try {
      console.log('Merging video model face...')

      const request = new $videoenhan.MergeVideoModelFaceRequest({
        templateId: params.templateId,
        enhance: params.enhance !== undefined ? params.enhance : true,
        faceImageURL: params.mergeInfos[0]?.imageUrl, // For single-person template
        mergeInfos: params.mergeInfos.map(info => ({
          imageURL: info.imageUrl,
          templateFaceURL: info.templateFaceUrl
        }))
      })
      const runtime = new $Util.RuntimeOptions({})

      const response = await this.client.mergeVideoModelFaceWithOptions(request, runtime)

      // MergeVideoModelFace also returns requestId as jobId
      const jobId = response.body?.requestId || response.body?.data?.jobId
      if (!jobId) {
        throw new Error('Failed to merge video face: No requestId or jobId returned')
      }

      console.log('Face merge job started:', jobId)
      return jobId
    } catch (error: any) {
      console.error('Error merging video model face:', error.message)
      if (error.data?.Recommend) {
        console.error('Diagnostic URL:', error.data.Recommend)
      }
      throw new Error(`Failed to merge video model face: ${error.message}`)
    }
  }

  async getAsyncJobResult(jobId: string): Promise<JobResult> {
    try {
      const request = new $videoenhan.GetAsyncJobResultRequest({
        jobId: jobId
      })
      const runtime = new $Util.RuntimeOptions({})

      const response = await this.client.getAsyncJobResultWithOptions(request, runtime)

      const status = response.body?.data?.status
      const result: JobResult = {
        status: (status === 'SUCCESS' || status === 'PROCESS_SUCCESS') ? 'SUCCESS' : (status === 'FAILED' || status === 'PROCESS_FAILED') ? 'FAILED' : 'PROCESSING',
        data: response.body?.data
      }

      if ((status === 'SUCCESS' || status === 'PROCESS_SUCCESS') && response.body?.data?.result) {
        // Parse the result if it's a JSON string
        try {
          const parsedResult = JSON.parse(response.body.data.result)
          result.data = { ...result.data, ...parsedResult }
          result.videoUrl = parsedResult.videoUrl || parsedResult.VideoUrl
        } catch (e) {
          // If not JSON, use as is
          result.videoUrl = response.body.data.result
        }
      }

      if ((status === 'FAILED' || status === 'PROCESS_FAILED') && response.body?.data?.errorMessage) {
        result.errorMessage = response.body.data.errorMessage
      }

      return result
    } catch (error: any) {
      console.error('Error getting async job result:', error.message)
      throw new Error(`Failed to get job result: ${error.message}`)
    }
  }

  async pollJobResult(jobId: string, options: PollOptions = {}): Promise<JobResult> {
    const { maxAttempts = 60, interval = 5000 } = options

    console.log(`Polling job ${jobId} (max ${maxAttempts} attempts, ${interval}ms interval)`)

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`Polling attempt ${attempt}/${maxAttempts}...`)

      const result = await this.getAsyncJobResult(jobId)

      if (result.status === 'SUCCESS') {
        console.log('Job completed successfully!')
        return result
      }

      if (result.status === 'FAILED') {
        console.error('Job failed:', result.errorMessage)
        throw new Error(`Job failed: ${result.errorMessage || 'Unknown error'}`)
      }

      if (attempt < maxAttempts) {
        console.log(`Job still processing, waiting ${interval}ms before next poll...`)
        await new Promise(resolve => setTimeout(resolve, interval))
      }
    }

    throw new Error(`Job polling timeout after ${maxAttempts} attempts`)
  }

  async downloadVideo(url: string, destination: string): Promise<void> {
    try {
      console.log('Downloading video from:', url)
      console.log('Saving to:', destination)

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`)
      }

      const buffer = await response.arrayBuffer()

      const dir = path.dirname(destination)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      fs.writeFileSync(destination, Buffer.from(buffer))

      const stats = fs.statSync(destination)
      console.log(`Video downloaded successfully (${(stats.size / 1024 / 1024).toFixed(2)} MB)`)
    } catch (error: any) {
      console.error('Error downloading video:', error.message)
      throw new Error(`Failed to download video: ${error.message}`)
    }
  }

  async deleteFaceVideoTemplate(templateId: string): Promise<void> {
    try {
      console.log('Deleting face video template:', templateId)

      const request = new $videoenhan.DeleteFaceVideoTemplateRequest({
        templateId: templateId
      })
      const runtime = new $Util.RuntimeOptions({})

      await this.client.deleteFaceVideoTemplateWithOptions(request, runtime)

      console.log('Template deleted successfully')
    } catch (error: any) {
      console.error('Error deleting face video template:', error.message)
      if (error.data?.Recommend) {
        console.error('Diagnostic URL:', error.data.Recommend)
      }
      throw new Error(`Failed to delete template: ${error.message}`)
    }
  }
}

