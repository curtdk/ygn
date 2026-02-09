# 服务启动与配置指南

为了支持文件存储和搜索功能，本项目依赖 **MinIO** 和 **Meilisearch**。请按照以下步骤启动这些服务。

> **注意**: Meilisearch 现已集成完毕，支持前端产品搜索功能。您可以选择使用 Docker 或直接安装 Meilisearch。

## 1. 启动服务

### 方式一: 使用 Docker (推荐)

本项目提供了一个 `docker-compose.yml` 文件，可以一键启动所需服务。

在项目根目录下运行：

```bash
docker-compose up -d
```

这将启动：
- **MinIO** (对象存储): 
  - API 端口: `http://localhost:9000`
  - 控制台: `http://localhost:9001`
  - 账号: `minioadmin`
  - 密码: `minioadmin`
- **Meilisearch** (搜索引擎):
  - API 端口: `http://localhost:7700`
  - Master Key: `masterKey`

### 方式二: 直接安装 Meilisearch (不使用 Docker)

如果您不想使用 Docker，请查看详细的 Meilisearch 安装指南：

**📖 [查看完整安装文档](./MEILISEARCH_SETUP.md)**

快速启动：

```bash
# 安装 Meilisearch
curl -L https://install.meilisearch.com | sh
sudo mv ./meilisearch /usr/local/bin/

# 使用项目启动脚本
./scripts/start-meilisearch.sh
```

## 2. MinIO 初始化配置

服务启动后，您需要手动创建一个存储桶 (Bucket) 供 Medusa 使用。

1. 打开浏览器访问 [http://localhost:9001](http://localhost:9001)
2. 使用账号 `minioadmin` / `minioadmin` 登录。
3. 点击左侧菜单的 **Buckets**。
4. 点击 **Create Bucket**。
5. Bucket Name 输入: `medusa-media` (必须与 `.env` 文件中的 `MINIO_BUCKET` 一致)。
6. 点击 **Create Bucket**。
7. **重要配置**: 为了让前端能公开访问图片，需要设置访问策略：
   - 在 Bucket 列表中点击 `medusa-media`。
   - 点击 **Anonymous** (或 Access Policy)。
   - 点击 **Add Access Rule**。
   - Prefix 输入: `/` (或者留空表示所有)。
   - Access: 选择 `readonly` (只读)。
   - 保存。

## 3. 验证连接

确保 `medushaV2/.env` 文件中的配置与上述服务匹配：

```env
# MinIO
MINIO_ENDPOINT=http://localhost:9000
MINIO_BUCKET=medusa-media
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# MeiliSearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=masterKey
```

## 4. 使用搜索功能

### 前端搜索

项目已集成完整的搜索功能：

1. **导航栏搜索框**: 在顶部导航栏中输入关键词进行搜索
   - 支持实时搜索建议（输入 2 个字符后自动显示）
   - 显示产品缩略图和价格
   - 保存最近 10 条搜索历史
   
2. **搜索结果页面**: 访问 `/search?q=关键词` 查看完整搜索结果
   - 支持按相关性、价格、时间排序
   - 分页显示搜索结果
   - 产品卡片展示

### 搜索字段

当前搜索支持以下字段：
- 产品标题 (title)
- 产品描述 (description)
- 产品 SKU (variant_sku)
- 产品链接 (handle)

### 测试搜索功能

1. 启动 Meilisearch 服务（Docker 或脚本）
2. 启动 Medusa 后端：`cd medushaV2 && npm run dev`
3. 启动前端：`cd medushaV2-storefront && yarn dev`
4. 在 Medusa Admin 中创建或编辑产品（触发索引）
5. 访问 `http://localhost:8000`，使用顶部搜索框测试

## 5. 常见问题

- **端口冲突**: 如果 9000 或 7700 端口被占用，请修改 `docker-compose.yml` 中的端口映射，并同步更新 `.env` 文件。
- **搜索无结果**: 
  - 确保 Meilisearch 服务正在运行
  - 确保 Medusa 后端已启动并成功连接到 Meilisearch
  - 只有**新创建**或**更新**的产品才会被同步到 Meilisearch
  - 您可以尝试在 Medusa Admin 后台编辑并保存一个产品来触发同步
- **搜索建议不显示**: 检查浏览器控制台是否有错误，确保前端能正常访问后端 API

## 6. 相关文档

- **Meilisearch 完整安装指南**: [MEILISEARCH_SETUP.md](./MEILISEARCH_SETUP.md)
- **Meilisearch 官方文档**: https://www.meilisearch.com/docs
- **Medusa 文档**: https://docs.medusajs.com
