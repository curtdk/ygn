import { AliyunVideoFaceService } from '../services/aliyun-video-face'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Test resources provided by user
const TEST_VIDEO = 'http://viapi-test.oss-cn-shanghai.aliyuncs.com/viapi-3.0domepic/videoenhan/MergeVideoFace/MergeVideoFace2.mp4'
const SOURCE_FACE = 'http://viapi-test.oss-cn-shanghai.aliyuncs.com/viapi-3.0domepic/videoenhan/MergeVideoFace/MergeVideoFace-fm2.jpg'
const TARGET_FACE = 'http://viapi-test.oss-cn-shanghai.aliyuncs.com/viapi-3.0domepic/imageenhan/MakeSuperResolutionImage/MakeSuperResolutionImage10.png'

async function testAliyunVideoFaceReplacement() {
  console.log('='.repeat(80))
  console.log('Alibaba Cloud Video Face Replacement Test')
  console.log('='.repeat(80))
  console.log()

  const service = new AliyunVideoFaceService()
  let templateId: string | null = null

  try {
    // Step 1: Create face video template
    console.log('Step 1: Creating face video template...')
    console.log('Source video:', TEST_VIDEO)
    console.log()
    templateId = await service.createFaceVideoTemplate(TEST_VIDEO)
    console.log('✓ Template created:', templateId)
    console.log()

    // Step 2: Merge video face
    console.log('Step 2: Starting face replacement job...')
    console.log('Face in video:', SOURCE_FACE)
    console.log('Replacement face:', TARGET_FACE)
    console.log()
    const jobId = await service.mergeVideoModelFace({
      templateId,
      enhance: true,
      mergeInfos: [
        {
          imageUrl: TARGET_FACE,
          templateFaceUrl: SOURCE_FACE
        }
      ]
    })
    console.log('✓ Job started:', jobId)
    console.log()

    // Step 3: Poll for job completion
    console.log('Step 3: Polling for job completion...')
    console.log('This may take a few minutes...')
    console.log()
    const result = await service.pollJobResult(jobId, {
      maxAttempts: 60,
      interval: 5000
    })
    console.log('✓ Job completed successfully!')
    console.log('Generated video URL:', result.videoUrl)
    console.log()

    // Step 4: Download generated video
    console.log('Step 4: Downloading generated video...')
    const outputPath = path.join(process.cwd(), 'static', 'test-output.mp4')
    await service.downloadVideo(result.videoUrl!, outputPath)
    console.log('✓ Video downloaded to:', outputPath)
    console.log()

    // Step 5: Cleanup template
    console.log('Step 5: Cleaning up template...')
    await service.deleteFaceVideoTemplate(templateId)
    console.log('✓ Template deleted')
    console.log()

    // Success summary
    console.log('='.repeat(80))
    console.log('✓ TEST COMPLETED SUCCESSFULLY!')
    console.log('='.repeat(80))
    console.log()
    console.log('Output file:', outputPath)
    console.log('You can now play the video to verify the face replacement worked.')
    console.log()

  } catch (error: any) {
    console.error()
    console.error('='.repeat(80))
    console.error('✗ TEST FAILED')
    console.error('='.repeat(80))
    console.error()
    console.error('Error:', error.message)
    console.error()

    // Cleanup template on error
    if (templateId) {
      try {
        console.log('Attempting to cleanup template...')
        await service.deleteFaceVideoTemplate(templateId)
        console.log('✓ Template cleaned up')
      } catch (cleanupError: any) {
        console.error('Failed to cleanup template:', cleanupError.message)
      }
    }

    process.exit(1)
  }
}

// Run the test
testAliyunVideoFaceReplacement()

