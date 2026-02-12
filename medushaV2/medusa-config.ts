import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import multer from 'multer'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// 配置multer用于文件上传
const upload = multer({ storage: multer.memoryStorage() })

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      // 添加中间件配置
      middleware: [
        {
          method: ['POST'],
          matcher: '/store/uploads',
          middlewares: [upload.array('files')],
        },
      ],
    }
  },
  modules: [
    {
      resolve: "./src/modules/video-material",
    },
    {
      resolve: "./src/modules/user-video",
    },
  ],
  plugins: [
    {
      resolve: "@rokmohar/medusa-plugin-meilisearch",
      options: {
        config: {
          host: process.env.MEILISEARCH_HOST,
          apiKey: process.env.MEILISEARCH_API_KEY,
        },
        settings: {
          products: {
            type: "products",
            enabled: true,
            fields: [
              "id",
              "title",
              "description",
              "handle",
              "variant_sku",
              "thumbnail",
              "status",
              "created_at",
              "updated_at",
            ],
            indexSettings: {
              searchableAttributes: [
                "title",
                "description",
                "variant_sku",
                "handle",
              ],
              displayedAttributes: [
                "id",
                "handle",
                "title",
                "description",
                "variant_sku",
                "thumbnail",
                "status",
              ],
              filterableAttributes: [
                "id",
                "handle",
                "status",
              ],
              sortableAttributes: [
                "created_at",
                "updated_at",
              ],
            },
            primaryKey: "id",
          },
        },
      },
    },
  ],
})
