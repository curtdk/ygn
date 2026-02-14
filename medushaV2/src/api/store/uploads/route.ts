import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { uploadFilesWorkflow } from "@medusajs/core-flows"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })
const uploadMiddleware = upload.array("files")

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // 应用 multer 中间件解析 multipart/form-data
    await new Promise<void>((resolve, reject) => {
      uploadMiddleware(req as any, res as any, (err: any) => {
        if (err) reject(err)
        else resolve()
      })
    })

    const input = (req as any).files as any[]

    if (!input?.length) {
      return res.status(400).json({ error: "没有上传文件" })
    }

    // 使用与 admin/uploads 完全相同的 workflow
    const { result } = await uploadFilesWorkflow(req.scope).run({
      input: {
        files: input.map((f) => ({
          filename: f.originalname,
          mimeType: f.mimetype,
          content: f.buffer.toString("base64"),
          access: "public" as const,
        })),
      },
    })

    res.status(200).json({ files: result })
  } catch (error) {
    console.error("文件上传失败:", error)
    res.status(500).json({
      error: "文件上传失败",
      message: error instanceof Error ? error.message : String(error)
    })
  }
}
