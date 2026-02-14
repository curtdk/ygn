#!/bin/bash

# Medusa 项目一键部署脚本（适配宝塔面板 + 阿里云环境）
# 用法: ./deploy.sh [production|testing] [backend_path] [frontend_path] [deploy_path]
# 示例: ./deploy.sh production /www/wwwroot/ygn/medushaV2 /www/wwwroot/ygn/medushaV2-storefront /www/wwwroot/ygn/production/medusa

set -e

ENV_TYPE="${1:-production}"
BACKEND_PATH="${2:-/www/wwwroot/ygn/medushaV2}"
FRONTEND_PATH="${3:-/www/wwwroot/ygn/medushaV2-storefront}"
DEPLOY_BASE="${4:-/www/wwwroot/ygn}"

if [ "$ENV_TYPE" = "testing" ]; then
  DEPLOY_PATH="$DEPLOY_BASE/testing/medusa"
  BACKEND_PORT=9001
  FRONTEND_PORT=3001
  DOMAIN="test.your-domain.com"          # ← 改成你的测试域名
else
  DEPLOY_PATH="$DEPLOY_BASE/production/medusa"
  BACKEND_PORT=9000
  FRONTEND_PORT=3000
  DOMAIN="your-domain.com"               # ← 改成你的生产域名
fi

echo "部署环境: $ENV_TYPE"
echo "部署路径: $DEPLOY_PATH"
echo "后端端口: $BACKEND_PORT   前端端口: $FRONTEND_PORT"

mkdir -p "$DEPLOY_PATH/backend"
mkdir -p "$DEPLOY_PATH/frontend"

# 构建后端
cd "$BACKEND_PATH"
npm run build || yarn build
cp -r .medusa/server/* "$DEPLOY_PATH/backend/"
cp .env "$DEPLOY_PATH/backend/.env" 2>/dev/null || echo "后端 .env 未找到，手动配置"

# 构建前端
cd "$FRONTEND_PATH"
npm run build || yarn build
cp -r .next/* "$DEPLOY_PATH/frontend/.next/" || true
[ -d public ] && cp -r public/* "$DEPLOY_PATH/frontend/public/" || true
cp package.json "$DEPLOY_PATH/frontend/"
cp yarn.lock "$DEPLOY_PATH/frontend/" 2>/dev/null || cp package-lock.json "$DEPLOY_PATH/frontend/" 2>/dev/null || true
cp next.config.js "$DEPLOY_PATH/frontend/" 2>/dev/null || true
cp .env "$DEPLOY_PATH/frontend/.env" 2>/dev/null || echo "前端 .env 未找到，手动配置"

# 安装依赖
cd "$DEPLOY_PATH/backend"
npm install --production || yarn install --production

cd "$DEPLOY_PATH/frontend"
npm install --production || yarn install --production

# PM2 配置 - 后端
cat > "$DEPLOY_PATH/backend/ecosystem.config.js" <<EOT
module.exports = {
  apps: [{
    name: 'medusa-backend-$ENV_TYPE',
    script: 'main.js',
    cwd: __dirname,
    env: { NODE_ENV: '$ENV_TYPE', PORT: $BACKEND_PORT },
    instances: 1,
    autorestart: true,
    watch: false
  }]
}
EOT

# PM2 配置 - 前端
cat > "$DEPLOY_PATH/frontend/ecosystem.config.js" <<EOT
module.exports = {
  apps: [{
    name: 'medusa-frontend-$ENV_TYPE',
    script: 'npm',
    args: 'start',
    cwd: __dirname,
    env: { NODE_ENV: '$ENV_TYPE', PORT: $FRONTEND_PORT },
    instances: 1,
    autorestart: true,
    watch: false
  }]
}
EOT

pm2 start "$DEPLOY_PATH/backend/ecosystem.config.js" --env production
pm2 start "$DEPLOY_PATH/frontend/ecosystem.config.js" --env production
pm2 save

# Nginx 配置（宝塔路径）
NGINX_VHOST_DIR="/www/server/panel/vhost/nginx"
NGINX_CONF="$NGINX_VHOST_DIR/$DOMAIN.conf"

cat > "$NGINX_CONF" <<EOT
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$FRONTEND_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location ~ ^/(api|store|auth|admin|health|files|static|uploads) {
        proxy_pass http://127.0.0.1:$BACKEND_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 静态文件优化（可选）
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        access_log off;
    }
}
EOT

echo "Nginx 配置已写入: $NGINX_CONF"

# 宝塔环境下重载 Nginx（更安全的方式）
/www/server/nginx/sbin/nginx -t && /www/server/nginx/sbin/nginx -s reload
# 或者用 systemctl（如果宝塔用了 systemd）
# systemctl reload nginx 2>/dev/null || true

echo "部署完成！"
echo "请检查并编辑:"
echo "  $DEPLOY_PATH/backend/.env"
echo "  $DEPLOY_PATH/frontend/.env"
echo "PM2 状态: pm2 list"
echo "访问测试: http://$DOMAIN"
echo "如果 Nginx 未生效，请登录宝塔面板 → 网站 → $DOMAIN → 配置 → 保存并重启 Nginx"