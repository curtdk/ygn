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
    }
  },
  modules: [
    {
      resolve: "./src/modules/video-material",
    },
    {
      resolve: "./src/modules/user-video",
    },
    {
      resolve: "./src/modules/service-provider",
    },
    {
      resolve: "./src/modules/service-product",
    },
    {
      resolve: "./src/modules/commission",
    },
    {
      resolve: "./src/modules/service-settings",
    },
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
              additional_client_config: {
                forcePathStyle: false,
              },
            },
          },
        ],
      },
    },
  ],
  plugins: []
})