import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,

   

    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
      // cookieSecure: false, 
      
      /**
       * 设置为 "lax" 或 "none"（none 需开启 secure）。
       * 对于通过 Nginx 代理的情况，"lax" 是最稳妥的选择。
       */
      // cookieSameSite: "lax",
      
    }
  },
  modules: [
    {
      resolve: "./src/modules/video-material",
    },
    {
      resolve: "./src/modules/user-video",
    },
    // 阿里云 OSS 文件存储配置
    {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-s3",
            id: "s3",
            options: {
              file_url: process.env.OSS_FILE_URL,
              access_key_id: process.env.ALIYUN_ACCESS_KEY_ID,
              secret_access_key: process.env.ALIYUN_ACCESS_KEY_SECRET,
              region: process.env.OSS_REGION,
              bucket: process.env.OSS_BUCKET,
              endpoint: process.env.OSS_ENDPOINT,
              prefix: "uploads/",
              // 阿里云 OSS 使用虚拟主机风格访问
              additional_client_config: {
                forcePathStyle: false,
              },
            },
          },
        ],
      },
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
