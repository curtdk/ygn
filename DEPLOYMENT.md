# Medusa 项目部署文档

## 项目概述

- **项目名称**: YGN 视频生成平台
- **后端**: Medusa v2 (端口 9000)
- **前端**: Next.js 15 (端口 8000)
- **搜索服务**: Meilisearch (端口 7700)
- **数据库**: PostgreSQL
- **文件存储**: 阿里云 OSS
- **支付**: 支付宝

## 目录结构

```
/www/wwwroot/nextjs/ygn/
├── medushaV2/                    # 后端项目
├── medushaV2-storefront/         # 前端项目
├── scripts/                      # 脚本目录
│   └── start-meilisearch.sh     # Meilisearch 启动脚本
├── logs/                         # PM2 日志目录（需创建）
├── meilisearch_data/             # Meilisearch 数据目录
├── ecosystem.config.js           # PM2 配置文件
└── nginx-medusa.conf             # Nginx 配置文件
```

## 环境要求

- Node.js >= 20
- PostgreSQL >= 14
- Redis (可选，用于生产环境)
- Meilisearch >= 1.6
- PM2 (进程管理器)
- Nginx (反向代理)

---

## 一、开发环境部署

### 1.1 安装依赖

```bash
# 后端依赖
cd /www/wwwroot/nextjs/ygn/medushaV2
npm install

# 前端依赖
cd /www/wwwroot/nextjs/ygn/medushaV2-storefront
npm install
```

### 1.2 配置环境变量

后端环境变量文件：`/www/wwwroot/nextjs/ygn/medushaV2/.env`

```bash
# 数据库配置
DATABASE_URL=postgres://postgres@localhost/ygn

# CORS 配置
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000,http://localhost:8000

# JWT 密钥
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret

# Meilisearch 配置
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your-meilisearch-key

# 阿里云 OSS 配置
ALIYUN_ACCESS_KEY_ID=your-access-key-id
ALIYUN_ACCESS_KEY_SECRET=your-access-key-secret
OSS_ENDPOINT=https://oss-cn-shanghai.aliyuncs.com
OSS_BUCKET=your-bucket-name
OSS_REGION=oss-cn-shanghai
OSS_FILE_URL=https://your-bucket.oss-cn-shanghai.aliyuncs.com

# 支付宝配置
ALIPAY_APP_ID=your-app-id
ALIPAY_PRIVATE_KEY=your-private-key
ALIPAY_PUBLIC_KEY=your-public-key
ALIPAY_NOTIFY_URL=http://your-domain.com/store/alipay/notify
FRONTEND_URL=http://localhost:8000
BACKEND_URL=http://localhost:9000
```

前端环境变量文件：`/www/wwwroot/nextjs/ygn/medushaV2-storefront/.env.local`

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your-publishable-key
```

### 1.3 数据库初始化

```bash
cd /www/wwwroot/nextjs/ygn/medushaV2

# 运行数据库迁移
npm run build

# 可选：导入种子数据
npm run seed
```

### 1.4 启动开发服务

**方式一：手动启动（推荐用于开发调试）**

```bash
# 终端 1: 启动 Meilisearch
cd /www/wwwroot/nextjs/ygn
bash scripts/start-meilisearch.sh

# 终端 2: 启动后端
cd /www/wwwroot/nextjs/ygn/medushaV2
npm run dev

# 终端 3: 启动前端
cd /www/wwwroot/nextjs/ygn/medushaV2-storefront
npm run dev
```

**方式二：使用 PM2（推荐用于开发环境持久化）**

```bash
# 创建日志目录
mkdir -p /www/wwwroot/nextjs/ygn/logs

# 启动所有服务
cd /www/wwwroot/nextjs/ygn
pm2 start ecosystem.config.js --only meilisearch
pm2 start ecosystem.config.js --only medusa-backend --env development
pm2 start ecosystem.config.js --only medusa-frontend --env development

# 查看服务状态
pm2 status

# 查看日志
pm2 logs

# 停止服务
pm2 stop all

# 重启服务
pm2 restart all
```

### 1.5 访问应用

- **前端**: http://localhost:8000
- **后端 API**: http://localhost:9000
- **后端管理**: http://localhost:9000/app
- **Meilisearch**: http://localhost:7700

---

## 二、生产环境部署

### 2.1 构建项目

```bash
# 构建后端
cd /www/wwwroot/nextjs/ygn/medushaV2
npm run build

# 构建前端
cd /www/wwwroot/nextjs/ygn/medushaV2-storefront
npm run build
```

### 2.2 配置生产环境变量

修改 `/www/wwwroot/nextjs/ygn/medushaV2/.env`：

```bash
# 更新 CORS 为生产域名
STORE_CORS=https://your-domain.com
ADMIN_CORS=https://your-domain.com
AUTH_CORS=https://your-domain.com

# 更新支付宝回调 URL
ALIPAY_NOTIFY_URL=https://your-domain.com/store/alipay/notify
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://your-domain.com

# 生产环境建议使用 Redis
REDIS_URL=redis://localhost:6379

# 更新 Meilisearch 环境
MEILI_ENV=production
```

修改 `/www/wwwroot/nextjs/ygn/medushaV2-storefront/.env.production`：

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-domain.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your-publishable-key
```

### 2.3 配置 Nginx

```bash
# 复制 Nginx 配置文件
sudo cp /www/wwwroot/nextjs/ygn/nginx-medusa.conf /etc/nginx/sites-available/medusa-ygn

# 修改配置文件中的域名
sudo nano /etc/nginx/sites-available/medusa-ygn
# 将 your-domain.com 替换为实际域名

# 创建软链接
sudo ln -s /etc/nginx/sites-available/medusa-ygn /etc/nginx/sites-enabled/

# 测试 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 2.4 配置 SSL 证书（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 证书会自动配置到 Nginx
# 证书自动续期已配置（通过 systemd timer）
```

### 2.5 使用 PM2 启动生产服务

```bash
# 创建日志目录
mkdir -p /www/wwwroot/nextjs/ygn/logs

# 启动所有服务
cd /www/wwwroot/nextjs/ygn
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save

# 设置 PM2 开机自启
pm2 startup
# 按照提示执行命令

# 查看服务状态
pm2 status

# 查看日志
pm2 logs

# 监控服务
pm2 monit
```

### 2.6 配置防火墙

```bash
# 允许 HTTP 和 HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 确保 SSH 端口开放
sudo ufw allow 22/tcp

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

---

## 三、PM2 常用命令

### 3.1 服务管理

```bash
# 启动所有服务
pm2 start ecosystem.config.js

# 启动单个服务
pm2 start ecosystem.config.js --only meilisearch
pm2 start ecosystem.config.js --only medusa-backend
pm2 start ecosystem.config.js --only medusa-frontend

# 停止服务
pm2 stop all                    # 停止所有
pm2 stop meilisearch            # 停止单个
pm2 stop medusa-backend
pm2 stop medusa-frontend

# 重启服务
pm2 restart all                 # 重启所有
pm2 restart medusa-backend      # 重启单个

# 删除服务
pm2 delete all                  # 删除所有
pm2 delete medusa-backend       # 删除单个

# 重新加载（零停机）
pm2 reload medusa-backend
```

### 3.2 日志管理

```bash
# 查看所有日志
pm2 logs

# 查看特定服务日志
pm2 logs medusa-backend

# 清空日志
pm2 flush

# 实时日志（带过滤）
pm2 logs --lines 100
pm2 logs medusa-backend --lines 50
```

### 3.3 监控和状态

```bash
# 查看服务状态
pm2 status

# 查看详细信息
pm2 show medusa-backend

# 实时监控
pm2 monit

# 查看资源使用
pm2 list
```

### 3.4 配置管理

```bash
# 保存当前配置
pm2 save

# 恢复保存的配置
pm2 resurrect

# 清除保存的配置
pm2 cleardump
```

---

## 四、Nginx 常用命令

```bash
# 测试配置文件
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 重新加载配置（不中断服务）
sudo systemctl reload nginx

# 查看 Nginx 状态
sudo systemctl status nginx

# 查看错误日志
sudo tail -f /var/log/nginx/medusa-error.log

# 查看访问日志
sudo tail -f /var/log/nginx/medusa-access.log
```

---

## 五、故障排查

### 5.1 服务无法启动

```bash
# 检查端口占用
sudo lsof -i :9000  # 后端
sudo lsof -i :8000  # 前端
sudo lsof -i :7700  # Meilisearch

# 检查 PM2 日志
pm2 logs medusa-backend --lines 100

# 检查系统资源
free -h
df -h
```

### 5.2 数据库连接问题

```bash
# 测试数据库连接
psql -U postgres -d ygn

# 检查 PostgreSQL 状态
sudo systemctl status postgresql

# 查看 PostgreSQL 日志
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### 5.3 Meilisearch 问题

```bash
# 检查 Meilisearch 状态
curl http://localhost:7700/health

# 重启 Meilisearch
pm2 restart meilisearch

# 查看 Meilisearch 日志
pm2 logs meilisearch
```

### 5.4 Nginx 问题

```bash
# 检查 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 检查端口监听
sudo netstat -tlnp | grep nginx
```

---

## 六、备份和恢复

### 6.1 数据库备份

```bash
# 备份数据库
pg_dump -U postgres ygn > /backup/ygn_$(date +%Y%m%d).sql

# 恢复数据库
psql -U postgres ygn < /backup/ygn_20240101.sql
```

### 6.2 Meilisearch 数据备份

```bash
# 备份 Meilisearch 数据
tar -czf /backup/meilisearch_$(date +%Y%m%d).tar.gz /www/wwwroot/nextjs/ygn/meilisearch_data

# 恢复 Meilisearch 数据
tar -xzf /backup/meilisearch_20240101.tar.gz -C /www/wwwroot/nextjs/ygn/
```

### 6.3 代码备份

```bash
# 使用 Git 管理代码
cd /www/wwwroot/nextjs/ygn/medushaV2
git add .
git commit -m "Production deployment"
git push origin main
```

---

## 七、性能优化

### 7.1 PM2 集群模式（可选）

修改 `ecosystem.config.js`：

```javascript
{
  name: 'medusa-backend',
  instances: 2,  // 或 'max' 使用所有 CPU 核心
  exec_mode: 'cluster'
}
```

### 7.2 Nginx 缓存配置

在 Nginx 配置中添加：

```nginx
# 缓存配置
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=medusa_cache:10m max_size=1g inactive=60m;

location /api/ {
    proxy_cache medusa_cache;
    proxy_cache_valid 200 10m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
}
```

### 7.3 数据库优化

```sql
-- 创建索引
CREATE INDEX idx_user_videos_user_id ON user_video(user_id);
CREATE INDEX idx_user_videos_status ON user_video(status);

-- 定期清理
VACUUM ANALYZE;
```

---

## 八、监控和告警

### 8.1 PM2 Plus（可选）

```bash
# 注册 PM2 Plus
pm2 link <secret_key> <public_key>

# 访问 https://app.pm2.io 查看监控
```

### 8.2 日志监控

```bash
# 使用 logrotate 管理日志
sudo nano /etc/logrotate.d/medusa

# 添加配置
/www/wwwroot/nextjs/ygn/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

---

## 九、快速参考

### 9.1 一键启动（生产环境）

```bash
cd /www/wwwroot/nextjs/ygn && pm2 start ecosystem.config.js
```

### 9.2 一键停止

```bash
pm2 stop all
```

### 9.3 一键重启

```bash
pm2 restart all
```

### 9.4 查看状态

```bash
pm2 status && sudo systemctl status nginx
```

### 9.5 查看日志

```bash
pm2 logs --lines 50
```

---

## 十、联系和支持

- **项目文档**: /www/wwwroot/nextjs/ygn/README.md
- **配置文件**: /www/wwwroot/nextjs/ygn/ecosystem.config.js
- **Nginx 配置**: /www/wwwroot/nextjs/ygn/nginx-medusa.conf
- **日志目录**: /www/wwwroot/nextjs/ygn/logs/

---

## 附录：环境检查清单

部署前检查：

- [ ] Node.js 版本 >= 20
- [ ] PostgreSQL 已安装并运行
- [ ] Meilisearch 已安装
- [ ] PM2 已全局安装
- [ ] Nginx 已安装并配置
- [ ] 环境变量已正确配置
- [ ] 数据库已创建并迁移
- [ ] SSL 证书已配置（生产环境）
- [ ] 防火墙规则已配置
- [ ] 域名 DNS 已解析

部署后检查：

- [ ] 所有 PM2 服务状态为 online
- [ ] Nginx 配置测试通过
- [ ] 前端页面可访问
- [ ] 后端 API 可访问
- [ ] 管理后台可访问
- [ ] 数据库连接正常
- [ ] Meilisearch 搜索功能正常
- [ ] 文件上传功能正常
- [ ] 支付功能正常
- [ ] SSL 证书有效
