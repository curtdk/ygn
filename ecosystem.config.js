module.exports = {
  apps: [
    {
      name: 'meilisearch',
      script: '/usr/local/bin/meilisearch',
      cwd: '/www/wwwroot/nextjs/ygn',
      env: {
        MEILI_MASTER_KEY: 'aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs',
        MEILI_ENV: 'production',
        MEILI_HTTP_ADDR: 'localhost:7700',
        MEILI_DB_PATH: './meilisearch_data'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      error_file: './logs/meilisearch-error.log',
      out_file: './logs/meilisearch-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'medusa-backend',
      script: 'npm',
      args: 'run dev',
      cwd: '/www/wwwroot/nextjs/ygn/medushaV2',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 9000
      },
      error_file: './logs/medusa-backend-error.log',
      out_file: './logs/medusa-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'medusa-frontend',
      script: 'npm',
      args: 'run start',
      cwd: '/www/wwwroot/nextjs/ygn/medushaV2-storefront',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      },
      error_file: './logs/medusa-frontend-error.log',
      out_file: './logs/medusa-frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
}
