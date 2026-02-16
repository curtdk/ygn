# Nginx 代理问题解决方案

## 问题描述

用户报告通过 Nginx 代理 (`http://127.0.0.1:90/`) 访问时出现以下问题：
- 后端无法登录
- 前端无法登录
- 视频生成报错
- PM2 日志只显示 meilisearch 详细信息，看不到后端/前端日志

## 根本原因

### 1. Meilisearch 服务未运行（主要问题）

**症状**：
- 后端启动失败，PM2 显示 800 次重启
- 所有服务状态为 stopped
- 直接访问端口也无法工作

**原因**：
- Medusa 后端依赖 Meilisearch 搜索引擎
- Meilisearch 服务未启动
- 后端启动时尝试连接 `http://localhost:7700`，连接失败导致崩溃
- PM2 自动重启，但每次都因为同样的原因失败

**错误日志**：
```
error: Loaders for module Meilisearch failed:
Request to http://localhost:7700/indexes/products/settings has failed
```

**解决方案**：
```bash
cd /www/wwwroot/nextjs/ygn
pm2 start ecosystem.config.js
```

这会按正确顺序启动所有服务：
1. Meilisearch (端口 7700)
2. Medusa Backend (端口 9000)
3. Medusa Frontend (端口 8000)

### 2. Nginx 路由配置问题（次要问题）

**症状**：
- 访问 `http://127.0.0.1:90/app` 返回 `/dk/app` 而不是 admin 面板
- Admin 面板无法通过 Nginx 访问

**原因**：
- 原始 Nginx 配置：`location ~ ^/(api|admin|store|auth|hooks|app|cloud|app)/ {`
- 这个正则表达式要求路径必须以 `/` 结尾
- 访问 `/app` (没有尾部斜杠) 不匹配，被转发到前端
- 前端将其重定向到 `/dk/app`

**解决方案**：
修改 Nginx 配置文件 `/www/server/panel/vhost/nginx/127.0.0.1_90.conf`：

```nginx
# 修改前
location ~ ^/(api|admin|store|auth|hooks|app|cloud|app)/ {

# 修改后
location ~ ^/(api|admin|store|auth|hooks|app|cloud)(/|$) {
```

变更说明：
- 移除重复的 `app`
- 将 `/` 改为 `(/|$)`，匹配有或没有尾部斜杠的路径

然后重新加载 Nginx：
```bash
nginx -t
nginx -s reload
```

## 验证步骤

### 1. 检查服务状态
```bash
pm2 status
```

应该显示所有服务为 `online`：
- meilisearch: online
- medusa-backend: online
- medusa-frontend: online

### 2. 测试后端健康检查
```bash
# 直接访问
curl http://localhost:9000/health
# 应该返回: OK

# 通过 Nginx 访问
curl http://127.0.0.1:90/health
# 应该返回: OK
```

### 3. 测试 Admin 面板
```bash
# 直接访问
curl http://localhost:9000/app
# 应该返回 HTML

# 通过 Nginx 访问
curl http://127.0.0.1:90/app
# 应该返回相同的 HTML
```

在浏览器中访问：
- Admin 面板: `http://127.0.0.1:90/app`
- 前端: `http://127.0.0.1:90/`

### 4. 检查日志
```bash
# 查看所有服务日志
pm2 logs --lines 20

# 查看特定服务日志
pm2 logs medusa-backend --lines 50
pm2 logs medusa-frontend --lines 50
pm2 logs meilisearch --lines 50
```

## 当前配置状态

### PM2 配置 (ecosystem.config.js)
- **后端**: 生产模式 (`npm run start`)
- **前端**: 生产模式 (`npm run start`)
- **Meilisearch**: 独立进程

### Nginx 配置
- **监听端口**: 90
- **后端路由**: `/api`, `/admin`, `/store`, `/auth`, `/hooks`, `/app`, `/cloud` → `localhost:9000`
- **前端路由**: 其他所有路由 → `localhost:8000`
- **超时设置**: 300 秒（适合视频生成）

### 符号链接
Admin 静态文件通过符号链接解决路径问题：
```bash
/www/wwwroot/nextjs/ygn/medushaV2/public/admin
→ /www/wwwroot/nextjs/ygn/medushaV2/.medusa/server/public/admin
```

## 常见问题

### Q: 为什么直接访问 `/www/wwwroot/nextjs/ygn/medushaV2/public/admin/index.html` 失败？

A: Admin 面板不应该直接访问静态文件。它需要通过 Medusa 后端服务器访问：
- ✅ 正确: `http://localhost:9000/app` 或 `http://127.0.0.1:90/app`
- ❌ 错误: 直接访问文件系统中的 HTML 文件

### Q: 为什么改名为 `public1` 并使用 `npm run dev` 就能工作？

A: 开发模式 (`npm run dev`) 不依赖预构建的静态文件，它实时编译和提供 admin 面板。这就是为什么文件位置不重要。但生产模式需要正确的文件路径和符号链接。

### Q: PM2 日志为什么只显示 meilisearch？

A: 当后端和前端正常运行时，它们的日志输出较少。Meilisearch 更详细地记录每个 HTTP 请求。你可以使用 `pm2 logs <service-name>` 查看特定服务的日志。

### Q: 如何重启服务？

A: 使用管理脚本：
```bash
cd /www/wwwroot/nextjs/ygn
./manage.sh restart
```

或直接使用 PM2：
```bash
pm2 restart all
# 或重启特定服务
pm2 restart medusa-backend
pm2 restart medusa-frontend
pm2 restart meilisearch
```

## 总结

问题已完全解决：
1. ✅ Meilisearch 服务已启动
2. ✅ 后端服务正常运行（生产模式）
3. ✅ 前端服务正常运行（生产模式）
4. ✅ Nginx 路由配置已修复
5. ✅ Admin 面板可通过 Nginx 访问
6. ✅ 所有 API 路由正常工作

现在可以通过 `http://127.0.0.1:90/` 正常访问整个应用。
