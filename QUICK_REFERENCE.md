# 快速参考指南

## 服务访问地址

### 通过 Nginx 代理访问（推荐）
- **前端**: http://127.0.0.1:90/
- **Admin 后台**: http://127.0.0.1:90/app
- **API 健康检查**: http://127.0.0.1:90/health

### 直接访问端口
- **前端**: http://localhost:8000/
- **后端 API**: http://localhost:9000/
- **Admin 后台**: http://localhost:9000/app
- **Meilisearch**: http://localhost:7700/

## 常用命令

### 服务管理

```bash
# 查看服务状态
pm2 status

# 启动所有服务
cd /www/wwwroot/nextjs/ygn
pm2 start ecosystem.config.js

# 重启所有服务
pm2 restart all

# 停止所有服务
pm2 stop all

# 重启单个服务
pm2 restart medusa-backend
pm2 restart medusa-frontend
pm2 restart meilisearch

# 查看日志
pm2 logs                          # 所有服务
pm2 logs medusa-backend          # 后端日志
pm2 logs medusa-frontend         # 前端日志
pm2 logs meilisearch             # 搜索引擎日志
pm2 logs --lines 100             # 查看更多行
```

### 使用管理脚本

```bash
cd /www/wwwroot/nextjs/ygn

# 启动服务
./manage.sh start

# 停止服务
./manage.sh stop

# 重启服务
./manage.sh restart

# 查看状态
./manage.sh status

# 查看日志
./manage.sh logs

# 完整部署（构建 + 启动）
./manage.sh deploy
```

### Nginx 管理

```bash
# 测试配置
nginx -t

# 重新加载配置
nginx -s reload

# 重启 Nginx
systemctl restart nginx

# 查看 Nginx 状态
systemctl status nginx

# 查看 Nginx 日志
tail -f /www/wwwlogs/127.0.0.1_90.log        # 访问日志
tail -f /www/wwwlogs/127.0.0.1_90.error.log  # 错误日志
```

### 后端开发

```bash
cd /www/wwwroot/nextjs/ygn/medushaV2

# 开发模式
npm run dev

# 构建
npm run build

# 生产模式启动
npm run start

# 数据库迁移
npm run db:migrate

# 创建管理员用户
npm run user:create
```

### 前端开发

```bash
cd /www/wwwroot/nextjs/ygn/medushaV2-storefront

# 开发模式
npm run dev

# 构建
npm run build

# 生产模式启动
npm run start
```

## 故障排查

### 服务无法启动

1. **检查 Meilisearch 是否运行**
   ```bash
   pm2 status
   # 如果 meilisearch 是 stopped，先启动它
   pm2 restart meilisearch
   # 等待几秒后再启动后端
   pm2 restart medusa-backend
   ```

2. **检查端口占用**
   ```bash
   lsof -i :9000  # 后端端口
   lsof -i :8000  # 前端端口
   lsof -i :7700  # Meilisearch 端口
   ```

3. **查看详细错误日志**
   ```bash
   pm2 logs medusa-backend --lines 100 --err
   ```

### Nginx 代理问题

1. **测试 Nginx 配置**
   ```bash
   nginx -t
   ```

2. **检查后端是否响应**
   ```bash
   curl http://localhost:9000/health
   ```

3. **检查 Nginx 是否正确代理**
   ```bash
   curl http://127.0.0.1:90/health
   ```

### Admin 面板无法访问

1. **确认符号链接存在**
   ```bash
   ls -la /www/wwwroot/nextjs/ygn/medushaV2/public/admin
   # 应该显示符号链接指向 .medusa/server/public/admin
   ```

2. **如果符号链接丢失，重新创建**
   ```bash
   cd /www/wwwroot/nextjs/ygn/medushaV2
   mkdir -p public
   ln -sf "$(pwd)/.medusa/server/public/admin" public/admin
   ```

3. **重启后端服务**
   ```bash
   pm2 restart medusa-backend
   ```

### 数据库连接问题

1. **检查 PostgreSQL 状态**
   ```bash
   systemctl status postgresql
   ```

2. **检查数据库连接配置**
   ```bash
   cat /www/wwwroot/nextjs/ygn/medushaV2/.env | grep DATABASE_URL
   ```

### CORS 错误

1. **检查 CORS 配置**
   ```bash
   cat /www/wwwroot/nextjs/ygn/medushaV2/.env | grep CORS
   ```

2. **确保包含正确的域名**
   ```
   STORE_CORS=http://localhost:8000,http://127.0.0.1:90
   ADMIN_CORS=http://localhost:9000,http://127.0.0.1:90
   AUTH_CORS=http://localhost:9000,http://localhost:8000,http://127.0.0.1:90
   ```

## 重要文件位置

### 配置文件
- **后端配置**: `/www/wwwroot/nextjs/ygn/medushaV2/.env`
- **Medusa 配置**: `/www/wwwroot/nextjs/ygn/medushaV2/medusa-config.ts`
- **PM2 配置**: `/www/wwwroot/nextjs/ygn/ecosystem.config.js`
- **Nginx 配置**: `/www/server/panel/vhost/nginx/127.0.0.1_90.conf`
- **管理脚本**: `/www/wwwroot/nextjs/ygn/manage.sh`

### 日志文件
- **后端日志**: `/www/wwwroot/nextjs/ygn/medushaV2/logs/`
- **前端日志**: `/www/wwwroot/nextjs/ygn/medushaV2-storefront/logs/`
- **Meilisearch 日志**: `/www/wwwroot/nextjs/ygn/logs/`
- **Nginx 日志**: `/www/wwwlogs/127.0.0.1_90.log`

### 构建输出
- **后端构建**: `/www/wwwroot/nextjs/ygn/medushaV2/.medusa/server/`
- **Admin 静态文件**: `/www/wwwroot/nextjs/ygn/medushaV2/.medusa/server/public/admin/`
- **前端构建**: `/www/wwwroot/nextjs/ygn/medushaV2-storefront/.next/`

## 性能监控

```bash
# 查看 PM2 监控面板
pm2 monit

# 查看资源使用情况
pm2 status

# 查看详细信息
pm2 show medusa-backend
pm2 show medusa-frontend
pm2 show meilisearch
```

## 备份和恢复

### 数据库备份
```bash
# 备份数据库
pg_dump -U postgres medushaV2n > backup_$(date +%Y%m%d).sql

# 恢复数据库
psql -U postgres medushaV2n < backup_20260216.sql
```

### 代码备份
```bash
# 创建代码备份
cd /www/wwwroot/nextjs
tar -czf ygn_backup_$(date +%Y%m%d).tar.gz ygn/

# 恢复代码
tar -xzf ygn_backup_20260216.tar.gz
```

## 更新和维护

### 更新依赖
```bash
# 后端
cd /www/wwwroot/nextjs/ygn/medushaV2
npm update

# 前端
cd /www/wwwroot/nextjs/ygn/medushaV2-storefront
npm update
```

### 清理和重建
```bash
# 后端
cd /www/wwwroot/nextjs/ygn/medushaV2
rm -rf node_modules .medusa
npm install
npm run build

# 前端
cd /www/wwwroot/nextjs/ygn/medushaV2-storefront
rm -rf node_modules .next
npm install
npm run build
```

## 安全提示

1. **定期更新依赖包**，修复安全漏洞
2. **定期备份数据库**，防止数据丢失
3. **监控日志文件**，及时发现异常
4. **限制 Admin 面板访问**，只允许信任的 IP
5. **使用强密码**，定期更换管理员密码
6. **启用 HTTPS**，保护数据传输安全

## 获取帮助

- **Medusa 文档**: https://docs.medusajs.com/
- **Next.js 文档**: https://nextjs.org/docs
- **PM2 文档**: https://pm2.keymetrics.io/docs/
- **Nginx 文档**: https://nginx.org/en/docs/
