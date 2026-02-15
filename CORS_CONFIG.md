# CORS 配置说明

## 问题描述

当前端从不同的域名或端口访问后端 API 时，会遇到 CORS（跨域资源共享）错误：

```
Access to fetch at 'http://localhost:9000/store/collections' from origin 'http://127.0.0.1:90'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 解决方案

在 Medusa 后端的 `.env` 文件中配置允许的源（origins）。

### 配置文件位置

`/www/wwwroot/nextjs/ygn/medushaV2/.env`

### 当前配置

```bash
# 商店 API 的 CORS 配置
STORE_CORS=http://localhost:8000,http://127.0.0.1:90,https://docs.medusajs.com

# 管理后台的 CORS 配置
ADMIN_CORS=http://localhost:5173,http://localhost:9000,http://127.0.0.1:90,https://docs.medusajs.com

# 认证 API 的 CORS 配置
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,http://127.0.0.1:90,https://docs.medusajs.com
```

### 配置说明

1. **STORE_CORS**: 允许访问商店 API（`/store/*`）的源
   - 前端应用需要在这里配置

2. **ADMIN_CORS**: 允许访问管理后台 API（`/admin/*`）的源
   - 管理后台应用需要在这里配置

3. **AUTH_CORS**: 允许访问认证 API 的源
   - 需要登录的应用需要在这里配置

### 添加新的域名

如果需要添加新的域名或端口，按照以下格式添加（用逗号分隔）：

```bash
STORE_CORS=http://localhost:8000,http://127.0.0.1:90,http://your-domain.com,https://your-domain.com
```

**注意事项**：
- 必须包含完整的协议（http:// 或 https://）
- 不要在末尾添加斜杠
- 多个源之间用逗号分隔，不要有空格
- 端口号必须明确指定（如果不是默认端口）

### 生产环境配置

在生产环境中，应该只允许实际的生产域名：

```bash
STORE_CORS=https://your-production-domain.com
ADMIN_CORS=https://admin.your-production-domain.com
AUTH_CORS=https://your-production-domain.com,https://admin.your-production-domain.com
```

**安全建议**：
- 不要使用通配符 `*`（允许所有源）
- 只添加需要的域名
- 在生产环境中移除开发域名（localhost, 127.0.0.1）

## 应用配置更改

修改 `.env` 文件后，需要重启后端服务：

```bash
# 使用 PM2
pm2 restart medusa-backend

# 或使用管理脚本
./manage.sh restart
```

## 常见问题

### 1. 修改后仍然有 CORS 错误

**解决方法**：
- 确认已重启后端服务
- 清除浏览器缓存
- 检查配置中是否有拼写错误
- 确认端口号是否正确

### 2. 开发环境和生产环境使用不同的域名

**解决方法**：
创建不同的环境变量文件：
- `.env.development` - 开发环境
- `.env.production` - 生产环境

或者在 PM2 配置中设置不同的环境变量。

### 3. 使用 Nginx 反向代理

如果使用 Nginx 反向代理，前端和后端可以使用同一个域名的不同路径，这样就不需要 CORS 配置：

```nginx
# 前端
location / {
    proxy_pass http://localhost:8000;
}

# 后端 API
location /api/ {
    proxy_pass http://localhost:9000/;
}
```

这样前端和后端都在同一个域名下，不会触发 CORS 检查。

## 当前环境

- **前端地址**: http://127.0.0.1:90
- **后端地址**: http://localhost:9000
- **CORS 状态**: ✅ 已配置

## 相关文件

- 环境变量配置：`/www/wwwroot/nextjs/ygn/medushaV2/.env`
- Medusa 配置：`/www/wwwroot/nextjs/ygn/medushaV2/medusa-config.ts`
- Nginx 配置：`/www/wwwroot/nextjs/ygn/nginx-medusa.conf`
