import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    console.log("收到上传请求")
    console.log("req.files:", (req as any).files)
    console.log("req.file:", (req as any).file)

    const fileService = req.scope.resolve(Modules.FILE)

    // 获取上传的文件
    const reqFiles = (req as any).files

    if (!reqFiles) {
      console.error("没有找到上传的文件")
      return res.status(400).json({ error: "没有上传文件" })
    }

    // 处理文件（可能是数组或对象）
    let fileArray: any[] = []
    if (Array.isArray(reqFiles)) {
      fileArray = reqFiles
    } else if ((reqFiles as any).files && Array.isArray((reqFiles as any).files)) {
      fileArray = (reqFiles as any).files
    } else {
      fileArray = [reqFiles]
    }

    if (fileArray.length === 0) {
      console.error("文件数组为空")
      return res.status(400).json({ error: "没有上传文件" })
    }

    const fileToUpload = fileArray[0]

    console.log("准备上传文件:", fileToUpload)

    // 上传文件
    const uploadedFiles = await fileService.createFiles([{
      filename: fileToUpload.originalname || fileToUpload.name,
      mimeType: fileToUpload.mimetype || fileToUpload.type,
      content: fileToUpload.buffer || fileToUpload.data,
    }])

    console.log("上传成功:", uploadedFiles)

    // 返回文件URL (FileDTO 只有 id 和 url 属性)
    res.json({
      url: uploadedFiles[0].url,
      id: uploadedFiles[0].id
    })
  } catch (error) {
    console.error("文件上传失败:", error)
    res.status(500).json({
      error: "文件上传失败",
      message: error instanceof Error ? error.message : String(error)
    })
  }
}
