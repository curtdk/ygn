import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    console.log("收到上传请求")
    console.log("req.files:", req.files)
    console.log("req.file:", req.file)

    const fileService = req.scope.resolve(Modules.FILE)

    // 获取上传的文件
    const files = req.files as any

    if (!files || (Array.isArray(files) && files.length === 0)) {
      console.error("没有找到上传的文件")
      return res.status(400).json({ error: "没有上传文件" })
    }

    // 处理文件数组或单个文件
    let fileToUpload
    if (Array.isArray(files)) {
      fileToUpload = files[0]
    } else if (files.files && Array.isArray(files.files)) {
      fileToUpload = files.files[0]
    } else {
      fileToUpload = files
    }

    console.log("准备上传文件:", fileToUpload)

    // 上传文件
    const uploadedFile = await fileService.uploadFile({
      filename: fileToUpload.originalname || fileToUpload.name,
      mimeType: fileToUpload.mimetype || fileToUpload.type,
      content: fileToUpload.buffer || fileToUpload.data,
    })

    console.log("上传成功:", uploadedFile)

    // 返回文件URL
    res.json({
      url: uploadedFile.url,
      key: uploadedFile.key
    })
  } catch (error) {
    console.error("文件上传失败:", error)
    res.status(500).json({
      error: "文件上传失败",
      message: error instanceof Error ? error.message : String(error)
    })
  }
}
