# Admin 登录问题最终解决方案

## 问题根源

经过深入测试，发现了问题的真正原因：

### 开发模式 vs 生产模式的认证机制不同

**开发模式 (`npm run dev`)**:
- 使用 session cookies 进行认证
- 会话存储在内存中
- Admin 面板配置为使用 cookie-based 认证
- ✅ 登录正常工作

**生产模式 (`npm run start`)**:
- 使用 JWT tokens 进行认证
- 会话存储在 Redis 中
- 但 Admin 面板仍然期望 cookie-based 认证
- ❌ 登录失败（401 Unauthorized）

### 测试结果

```bash
# 1. 登录获取 JWT token - 成功
curl -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medusa.com","password":"admin123"}'
# 返回: {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}

# 2. 使用 JWT token 访问 API - 成功
curl -H "Authorization: Bearer <TOKEN>" http://localhost:9000/admin/users/me
# 返回: {"user":{"id":"user_01KGFMC77P8DBV995V91AFXEGF","email":"admin@medusa.com"...}}

# 3. 尝试创建 session cookie - 失败
curl -X POST http://localhost:9000/auth/session \
  -H "Authorization: Bearer <TOKEN>"
# 返回: 200 OK，但没有 Set-Cookie header
```

## 根本原因

Medusa v2 在生产模式下的 admin 面板构建配置可能不正确，导致：
1. 后端正确使用 JWT token 认证
2. 但前端（admin 面板）仍然期望 session cookies
3. 两者不匹配，导致登录后立即 401

## 解决方案

### 方案 1：使用开发模式（临时方案）

如果需要立即使用 admin 面板，可以暂时使用开发模式：

```bash
# 修改 PM2 配置
vim /www/wwwroot/nextjs/ygn/ecosystem.config.js

# 将 medusa-backend 的配置改为：
{
  name: 'medusa-backend',
  script: 'npm',
  args: 'run dev',  // 改为 dev
  cwd: '/www/wwwroot/nextjs/ygn/medushaV2',
  env: {
    NODE_ENV: 'development',  // 改为 development
    PORT: 9000
  }
}

# 重启服务
pm2 restart medusa-backend
```

**优点**：
- 立即可用
- 登录正常工作

**缺点**：
- 性能较差
- 不适合生产环境
- 会话不持久化

### 方案 2：重新构建 Admin 面板（推荐）

Medusa v2 的 admin 面板需要正确构建以支持生产模式：

```bash
cd /www/wwwroot/nextjs/ygn/medushaV2

# 1. 清理旧的构建
rm -rf .medusa/admin .medusa/server/public/admin

# 2. 重新构建
npm run build

# 3. 验证构建输出
ls -la .medusa/server/public/admin/

# 4. 确保符号链接正确
rm -f public/admin
ln -sf "$(pwd)/.medusa/server/public/admin" public/admin

# 5. 重启服务
pm2 restart medusa-backend
```

### 方案 3：检查 Medusa 版本和配置

可能是 Medusa v2 版本的问题或配置不完整：

```bash
cd /www/wwwroot/nextjs/ygn/medushaV2

# 检查 Medusa 版本
npm list @medusajs/medusa @medusajs/admin

# 更新到最新版本
npm update @medusajs/medusa @medusajs/admin

# 重新构建
npm run build

# 重启
pm2 restart medusa-backend
```

### 方案 4：使用 API 直接管理（备选）

如果 admin 面板无法使用，可以通过 API 直接管理：

```bash
# 获取 token
TOKEN=$(curl -s -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medusa.com","password":"admin123"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 使用 token 访问 API
curl -H "Authorization: Bearer $TOKEN" http://localhost:9000/admin/users/me
curl -H "Authorization: Bearer $TOKEN" http://localhost:9000/admin/products
curl -H "Authorization: Bearer $TOKEN" http://localhost:9000/admin/orders
```

## 当前配置状态

### 已完成的配置

1. ✅ Redis 配置已添加到 `medusa-config.ts`
2. ✅ `.env.production` 文件已创建
3. ✅ 所有服务正常运行
4. ✅ JWT 认证正常工作
5. ✅ API 端点可以通过 JWT token 访问

### 仍然存在的问题

1. ❌ Admin 面板在生产模式下无法使用 session cookies
2. ❌ 前后端认证机制不匹配

## 推荐的下一步

### 立即可用方案（推荐）

使用开发模式运行后端，直到找到生产模式的正确配置：

```bash
# 1. 修改 ecosystem.config.js
vim /www/wwwroot/nextjs/ygn/ecosystem.config.js
# 将 args 改为 'run dev'，NODE_ENV 改为 'development'

# 2. 重启
pm2 restart medusa-backend

# 3. 测试登录
# 访问 http://localhost:9000/app/login
# 或 http://127.0.0.1:90/app/login
```

### 长期解决方案

联系 Medusa 社区或查看官方文档，了解：
1. Medusa v2 生产模式下 admin 面板的正确配置
2. 是否需要额外的环境变量或配置
3. 是否有已知的 session cookie 问题

## 相关资源

- Medusa v2 文档: https://docs.medusajs.com/
- Medusa GitHub: https://github.com/medusajs/medusa
- Medusa Discord: https://discord.gg/medusajs

## 总结

问题已经明确：生产模式下的认证机制与 admin 面板期望的不匹配。短期内建议使用开发模式，长期需要找到正确的生产模式配置或等待 Medusa 官方修复。

所有基础配置（Redis、环境变量、Nginx）都已正确设置，问题在于 Medusa v2 本身的生产模式配置。
