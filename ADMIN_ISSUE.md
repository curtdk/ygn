# Medusa 管理后台问题说明

## 问题描述

在使用 `npm run start` (生产模式) 启动 Medusa 后端时，会出现以下错误：

```
Error: Could not find index.html in the admin build directory.
Make sure to run 'medusa build' before starting the server.
```

## 原因分析

Medusa v2 在生产模式下启动时，会尝试加载管理后台的构建文件。虽然运行 `npm run build` 后文件确实存在于 `.medusa/server/public/admin/` 目录，但由于某些原因，Medusa 无法正确找到这些文件。

## 解决方案

### 方案一：使用开发模式（推荐）

在 PM2 配置中使用 `npm run dev` 而不是 `npm run start`：

```javascript
{
  name: 'medusa-backend',
  script: 'npm',
  args: 'run dev',  // 使用开发模式
  cwd: '/www/wwwroot/nextjs/ygn/medushaV2',
  env: {
    NODE_ENV: 'development',
    PORT: 9000
  }
}
```

**优点**：
- 启动稳定，不会出现管理后台错误
- 支持热重载（虽然在生产环境中不常用）
- 管理后台可以正常访问

**缺点**：
- 性能略低于生产模式
- 日志更详细（可能影响性能）

### 方案二：禁用管理后台

如果不需要管理后台，可以在 `medusa-config.ts` 中添加配置来禁用它：

```typescript
export default defineConfig({
  projectConfig: {
    // ... 其他配置
    admin: {
      disable: true  // 禁用管理后台
    }
  }
})
```

**优点**：
- 可以使用生产模式
- 减少资源占用

**缺点**：
- 无法访问管理后台
- 需要通过 API 或其他方式管理数据

### 方案三：单独部署管理后台

将管理后台作为独立应用部署：

1. 构建管理后台：`npm run build`
2. 将 `.medusa/server/public/admin/` 目录部署到静态文件服务器
3. 配置 Nginx 反向代理

## 当前配置

项目当前使用**方案一**（开发模式），配置文件：`/www/wwwroot/nextjs/ygn/ecosystem.config.js`

## 访问地址

- **API**: http://localhost:9000
- **管理后台**: http://localhost:9000/app
- **健康检查**: http://localhost:9000/health

## 注意事项

1. 开发模式虽然性能略低，但对于中小型应用影响不大
2. 如果需要最佳性能，建议使用方案二或方案三
3. 在生产环境中，建议配置 Redis 以提高性能

## 相关文件

- PM2 配置：`/www/wwwroot/nextjs/ygn/ecosystem.config.js`
- Medusa 配置：`/www/wwwroot/nextjs/ygn/medushaV2/medusa-config.ts`
- 部署文档：`/www/wwwroot/nextjs/ygn/DEPLOYMENT.md`
