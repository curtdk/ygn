# Admin 登录问题修复

## 问题描述

访问 `http://localhost:9000/app/login` 登录失败，虽然认证成功（status 200），但后续请求返回 401 Unauthorized。

## 根本原因

Medusa 在生产模式下需要 Redis 来存储会话（session）。日志显示：

```
info: redisUrl not found. A fake redis instance will be used.
```

"fake redis instance" 只适用于开发环境，不能在生产环境中持久化会话，导致登录后会话立即丢失。

## 解决方案

### 1. 已完成的修复

已在 `medusa-config.ts` 中添加 Redis 配置：

```typescript
projectConfig: {
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,  // 新增
  http: {
    // ...
  }
}
```

### 2. 验证 Redis 配置

检查 Redis 是否正常运行：

```bash
# 检查 Redis 服务状态
systemctl status redis

# 测试 Redis 连接
redis-cli ping
# 应该返回: PONG
```

检查环境变量：

```bash
cat /www/wwwroot/nextjs/ygn/medushaV2/.env | grep REDIS
# 应该显示: REDIS_URL=redis://localhost:6379
```

### 3. 重启服务

```bash
# 重启后端服务
pm2 restart medusa-backend

# 或重启所有服务
pm2 restart all
```

### 4. 验证修复

启动后端并检查日志：

```bash
cd /www/wwwroot/nextjs/ygn/medushaV2
npm run start
```

**成功的标志**：
- 日志中不再显示 "redisUrl not found"
- 日志中不再显示 "A fake redis instance will be used"
- 登录后可以正常访问 admin 面板

**失败的标志**：
- 仍然显示 "fake redis instance"
- 登录后立即返回 401

## 测试登录

### 方法 1：浏览器测试

1. 访问 `http://localhost:9000/app/login`
2. 输入管理员账号密码
3. 点击登录
4. 应该成功跳转到 admin 面板（如 `/app/orders`）
5. 刷新页面，应该仍然保持登录状态

### 方法 2：命令行测试

```bash
# 1. 登录并获取 cookie
curl -v -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medusa-test.com","password":"supersecret"}' \
  -c cookies.txt

# 2. 使用 cookie 访问受保护的端点
curl -b cookies.txt http://localhost:9000/admin/users/me

# 应该返回用户信息，而不是 401
```

## 通过 Nginx 代理访问

如果通过 Nginx 代理访问（`http://127.0.0.1:90/app`），需要确保 Nginx 正确转发 cookie：

```nginx
location ~ ^/(api|admin|store|auth|hooks|app|cloud)(/|$) {
    proxy_pass http://medusa_backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;

    # Cookie 转发（通常自动处理，但可以显式设置）
    proxy_set_header Cookie $http_cookie;
}
```

## 常见问题

### Q1: 登录成功但立即退出

**原因**: Redis 未正确配置或未运行

**解决**:
```bash
# 检查 Redis 状态
systemctl status redis

# 如果未运行，启动 Redis
systemctl start redis

# 重启 Medusa 后端
pm2 restart medusa-backend
```

### Q2: 日志仍显示 "fake redis instance"

**原因**: 配置未生效或环境变量未加载

**解决**:
```bash
# 1. 确认 .env 文件中有 REDIS_URL
echo "REDIS_URL=redis://localhost:6379" >> /www/wwwroot/nextjs/ygn/medushaV2/.env

# 2. 确认 medusa-config.ts 中有 redisUrl 配置
cat /www/wwwroot/nextjs/ygn/medushaV2/medusa-config.ts | grep redisUrl

# 3. 完全重启服务
pm2 delete medusa-backend
pm2 start /www/wwwroot/nextjs/ygn/ecosystem.config.js --only medusa-backend
```

### Q3: 通过 Nginx 访问时登录失败

**原因**: Cookie 域名或路径不匹配

**解决**:
1. 确保 ADMIN_CORS 包含 Nginx 域名：
   ```bash
   # 在 .env 中
   ADMIN_CORS=http://localhost:9000,http://127.0.0.1:90
   ```

2. 重启后端：
   ```bash
   pm2 restart medusa-backend
   ```

### Q4: Redis 连接错误

**错误信息**: `Error: connect ECONNREFUSED 127.0.0.1:6379`

**解决**:
```bash
# 检查 Redis 是否监听正确端口
netstat -tlnp | grep 6379

# 检查 Redis 配置
cat /www/server/redis/redis.conf | grep "bind\|port"

# 重启 Redis
systemctl restart redis
```

## 开发模式 vs 生产模式

### 开发模式 (`npm run dev`)
- ✅ 使用 fake Redis（内存中）
- ✅ 会话在进程重启后丢失
- ✅ 适合开发和测试
- ❌ 不适合生产环境

### 生产模式 (`npm run start`)
- ✅ 需要真实的 Redis 服务
- ✅ 会话持久化存储
- ✅ 支持多进程/多服务器
- ✅ 适合生产环境

## 当前配置状态

### Redis 配置
- **服务状态**: 运行中
- **端口**: 6379
- **连接地址**: redis://localhost:6379

### Medusa 配置
- **配置文件**: `/www/wwwroot/nextjs/ygn/medushaV2/medusa-config.ts`
- **环境变量**: `/www/wwwroot/nextjs/ygn/medushaV2/.env`
- **Redis URL**: 已配置

### PM2 配置
- **运行模式**: 生产模式 (`npm run start`)
- **进程名**: medusa-backend
- **端口**: 9000

## 下一步

1. **测试登录**: 访问 `http://localhost:9000/app/login` 或 `http://127.0.0.1:90/app/login`
2. **检查日志**: 确认不再显示 "fake redis instance"
3. **验证会话**: 登录后刷新页面，确认仍然保持登录状态
4. **监控 Redis**: 使用 `redis-cli monitor` 查看 Redis 操作

## 监控和调试

### 查看 Redis 中的会话

```bash
# 连接到 Redis
redis-cli

# 查看所有 key
KEYS *

# 查看会话数据（key 通常以 sess: 开头）
KEYS sess:*

# 查看特定会话的内容
GET sess:xxxxx

# 查看会话过期时间
TTL sess:xxxxx
```

### 实时监控 Redis 操作

```bash
# 实时查看 Redis 命令
redis-cli monitor

# 然后在浏览器中登录，观察 Redis 操作
```

### 查看后端日志

```bash
# 实时查看后端日志
pm2 logs medusa-backend --lines 100

# 查看错误日志
pm2 logs medusa-backend --err --lines 50
```

## 总结

Redis 配置已添加到 `medusa-config.ts`。重启服务后，Medusa 应该使用真实的 Redis 实例来存储会话，登录问题应该得到解决。

如果问题仍然存在，请检查：
1. Redis 服务是否正常运行
2. 环境变量是否正确加载
3. 后端日志中是否还有 "fake redis" 的提示
