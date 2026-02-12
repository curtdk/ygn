import multer from "multer"
import type { MiddlewaresConfig } from "@medusajs/framework/http"

// 使用内存存储来处理文件上传
const upload = multer({ storage: multer.memoryStorage() })

// 导出中间件配置（使用默认导出）
export default [
  {
    method: ["POST"],
    matcher: "/store/uploads",
    middlewares: [
      upload.array("files"),
    ],
  },
] as MiddlewaresConfig[]
