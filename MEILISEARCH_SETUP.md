# Meilisearch 安装和配置指南

本文档介绍如何在 **不使用 Docker** 的情况下安装和配置 Meilisearch 搜索引擎。

## 系统要求

- **操作系统**: Ubuntu 20.04+ 或其他 Linux 发行版
- **内存**: 至少 1GB RAM
- **磁盘空间**: 至少 500MB（根据产品数量增加）
- **端口**: 7700 端口可用

---

## 1. 安装 Meilisearch

### 方法 1: 自动安装（推荐）

使用官方安装脚本自动下载并安装最新版本：

```bash
curl -L https://install.meilisearch.com | sh
```

安装完成后，将 `meilisearch` 移动到系统路径：

```bash
sudo mv ./meilisearch /usr/local/bin/
```

### 方法 2: 手动下载

下载 Meilisearch v1.6.0 二进制文件：

```bash
# 下载
wget https://github.com/meilisearch/meilisearch/releases/download/v1.6.0/meilisearch-linux-amd64

# 赋予执行权限
chmod +x meilisearch-linux-amd64

# 移动到系统路径
sudo mv meilisearch-linux-amd64 /usr/local/bin/meilisearch
```

### 验证安装

```bash
meilisearch --version
```

应该输出: `meilisearch 1.6.0` (或更高版本)

---

## 2. 启动 Meilisearch 服务

### 使用启动脚本（推荐）

项目提供了启动脚本 `scripts/start-meilisearch.sh`：

```bash
cd /www/wwwroot/nextjs/medusha-project
./scripts/start-meilisearch.sh
```

**脚本会自动配置以下环境变量：**
- `MEILI_MASTER_KEY=masterKey` - 主密钥（用于认证）
- `MEILI_ENV=development` - 运行环境
- `MEILI_HTTP_ADDR=localhost:7700` - 监听地址
- `MEILI_DB_PATH=./meilisearch_data` - 数据存储目录

### 手动启动

如果不使用脚本，可以手动设置环境变量并启动：

```bash
export MEILI_MASTER_KEY="masterKey"
export MEILI_ENV="development"
export MEILI_HTTP_ADDR="localhost:7700"
export MEILI_DB_PATH="./meilisearch_data"

meilisearch
```

### 验证服务运行

打开浏览器访问: [http://localhost:7700](http://localhost:7700)

您应该看到 Meilisearch 的欢迎页面。

---

## 3. 使用进程管理器（生产环境推荐）

为了保持 Meilisearch 在后台运行并自动重启，建议使用 `pm2` 进程管理器：

### 安装 pm2

```bash
sudo npm install -g pm2
```

### 使用 pm2 启动 Meilisearch

创建 pm2 配置文件 `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'meilisearch',
    script: '/usr/local/bin/meilisearch',
    env: {
      MEILI_MASTER_KEY: 'masterKey',
      MEILI_ENV: 'development',
      MEILI_HTTP_ADDR: 'localhost:7700',
      MEILI_DB_PATH: './meilisearch_data'
    }
  }]
}
```

启动服务：

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### pm2 常用命令

```bash
pm2 status              # 查看服务状态
pm2 logs meilisearch    # 查看日志
pm2 restart meilisearch # 重启服务
pm2 stop meilisearch    # 停止服务
pm2 delete meilisearch  # 删除服务
```

---

## 4. 配置后端 Medusa

### 4.1 安装 Meilisearch 插件

在 `medushaV2/` 目录下安装插件：

```bash
cd medushaV2
npm install @rokmohar/medusa-plugin-meilisearch
```

### 4.2 配置环境变量

在 `medushaV2/.env` 文件中添加：

```env
# Meilisearch 配置
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=masterKey
```

### 4.3 配置 medusa-config.ts

插件已自动配置在 `medushaV2/medusa-config.ts` 中。

### 4.4 启动 Medusa 后端

```bash
cd medushaV2
npm run dev
```

启动后，插件会自动：
- 创建产品索引
- 监听产品创建/更新/删除事件
- 自动同步产品到 Meilisearch

---

## 5. 测试搜索功能

### 5.1 检查索引状态

访问 Meilisearch 仪表板（如果安装了）或使用 API：

```bash
curl -X GET 'http://localhost:7700/indexes' \
  -H 'Authorization: Bearer masterKey'
```

您应该看到 `products` 索引。

### 5.2 测试搜索

```bash
curl -X POST 'http://localhost:7700/indexes/products/search' \
  -H 'Authorization: Bearer masterKey' \
  -H 'Content-Type: application/json' \
  --data-binary '{"q": "shirt"}'
```

### 5.3 前端搜索

- 访问前端页面: [http://localhost:8000](http://localhost:8000)
- 在顶部导航栏使用搜索框
- 或访问搜索页面: [http://localhost:8000/search?q=shirt](http://localhost:8000/search?q=shirt)

---

## 6. 常见问题

### Q: 端口 7700 被占用怎么办？

修改 `MEILI_HTTP_ADDR` 环境变量为其他端口，例如：

```bash
export MEILI_HTTP_ADDR="localhost:7701"
```

同时更新 `medushaV2/.env` 中的 `MEILISEARCH_HOST`:

```env
MEILISEARCH_HOST=http://localhost:7701
```

### Q: 搜索无结果？

1. 确保 Meilisearch 服务正在运行
2. 确保 Medusa 后端已启动并成功连接到 Meilisearch
3. 在 Medusa Admin 中创建或编辑一个产品，触发索引同步
4. 检查 Medusa 后端日志是否有错误

### Q: 如何清空索引？

```bash
curl -X DELETE 'http://localhost:7700/indexes/products/documents' \
  -H 'Authorization: Bearer masterKey'
```

### Q: 如何备份 Meilisearch 数据？

直接备份数据目录：

```bash
tar -czf meilisearch_backup_$(date +%Y%m%d).tar.gz meilisearch_data/
```

### Q: 生产环境如何配置？

1. 使用强密钥替换 `masterKey`
2. 设置 `MEILI_ENV=production`
3. 配置防火墙，限制 7700 端口仅内部访问
4. 使用 `pm2` 或 `systemd` 管理进程
5. 配置日志记录和监控

---

## 7. 性能优化

### 7.1 调整索引设置

在 `medusa-config.ts` 中的插件配置可以调整：

- `searchableAttributes`: 搜索字段（越少越快）
- `filterableAttributes`: 可过滤字段
- `sortableAttributes`: 可排序字段

### 7.2 资源配置

根据产品数量调整服务器资源：

- **< 1,000 产品**: 1GB RAM
- **1,000 - 10,000 产品**: 2GB RAM
- **> 10,000 产品**: 4GB+ RAM

---

## 8. 安全建议

### 生产环境

1. **更改主密钥**: 使用强随机字符串
2. **使用 API Key**: 为前端创建只读搜索密钥
3. **启用 HTTPS**: 通过反向代理（Nginx/Caddy）
4. **限制访问**: 仅允许 Medusa 后端访问 Meilisearch

### 创建搜索 API Key

```bash
curl -X POST 'http://localhost:7700/keys' \
  -H 'Authorization: Bearer masterKey' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "description": "Search products key",
    "actions": ["search"],
    "indexes": ["products"],
    "expiresAt": null
  }'
```

---

## 9. 监控和维护

### 查看统计信息

```bash
curl -X GET 'http://localhost:7700/stats' \
  -H 'Authorization: Bearer masterKey'
```

### 查看健康状态

```bash
curl -X GET 'http://localhost:7700/health'
```

### 日志位置

如果使用 pm2:
```bash
pm2 logs meilisearch
```

如果使用脚本启动，日志在控制台输出。

---

## 10. 卸载 Meilisearch

如果需要卸载 Meilisearch：

```bash
# 停止服务
pm2 delete meilisearch  # 如果使用 pm2

# 删除二进制文件
sudo rm /usr/local/bin/meilisearch

# 删除数据目录
rm -rf meilisearch_data/
```

---

## 支持和文档

- **官方文档**: https://www.meilisearch.com/docs
- **GitHub**: https://github.com/meilisearch/meilisearch
- **Discord**: https://discord.meilisearch.com
- **插件文档**: https://github.com/rokmohar/medusa-plugin-meilisearch

---

**最后更新**: 2026-02-04
