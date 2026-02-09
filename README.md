# 🛍️ Medusa v2 + Next.js 15 电商项目

基于 **Medusa v2.13.1** 和 **Next.js 15** 的现代化电商平台，支持产品搜索、文件存储等功能。

---

## ✨ 主要功能

- 🔍 **全文搜索** - 基于 Meilisearch 的实时产品搜索
- 🛒 **购物车** - 完整的购物车和结账流程
- 💳 **支付集成** - 支持 Stripe 等支付方式
- 📦 **订单管理** - 完整的订单追踪系统
- 🌍 **多区域支持** - 支持多货币和多语言
- 📱 **响应式设计** - 完美支持移动端
- 🎨 **现代 UI** - 使用 Tailwind CSS + Medusa UI

---

## 🏗️ 技术栈

### 后端
- **Medusa v2.13.1** - 电商后端框架
- **PostgreSQL** - 数据库
- **Redis** - 缓存
- **Meilisearch v1.35** - 搜索引擎
- **MinIO** - 对象存储

### 前端
- **Next.js 15** - React 框架（App Router）
- **React 19** - UI 库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Medusa UI** - UI 组件库

---

## 📋 系统要求

- **Node.js** >= 20
- **PostgreSQL** >= 13
- **Redis** (可选)
- **npm** 或 **yarn**

---

## 🚀 快速启动

### 1. 安装依赖

```bash
# 后端
cd medushaV2
npm install

# 前端
cd medushaV2-storefront
yarn install
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp medushaV2/.env.template medushaV2/.env
cp medushaV2-storefront/.env.template medushaV2-storefront/.env.local

# 编辑 medushaV2/.env 配置数据库等信息
```

### 3. 启动 Meilisearch（搜索功能）

```bash
# 安装 Meilisearch
curl -L https://install.meilisearch.com | sh
sudo mv ./meilisearch /usr/local/bin/

# 启动服务
./scripts/start-meilisearch.sh
```

### 4. 启动后端

```bash
cd medushaV2
npm run dev
```

后端将在 `http://localhost:9000` 启动

### 5. 启动前端

```bash
cd medushaV2-storefront
yarn dev
```

前端将在 `http://localhost:8000` 启动

---

## 🔍 搜索功能

本项目已完整集成 **Meilisearch** 搜索引擎，支持：

### 功能特性
- ⚡ 实时搜索建议（300ms 防抖）
- 🖼️ 搜索结果显示产品缩略图和价格
- 📜 搜索历史记录（最近 10 条）
- 🎯 多字段搜索（标题、描述、SKU、链接）
- 🔄 多种排序方式（相关性、价格、时间）
- ⌨️ 完整的键盘导航支持
- 📱 响应式设计

### 快速测试

```bash
# 运行自动化测试
./scripts/test-search-setup.sh

# 手动测试搜索 API
curl -X POST 'http://localhost:7700/indexes/products/search' \
  -H 'Authorization: Bearer masterKey' \
  -H 'Content-Type: application/json' \
  --data-binary '{"q": "shirt"}'
```

### 详细文档
- 📖 [搜索功能快速启动](./SEARCH_QUICK_START.md) - 5 分钟快速上手
- 📖 [Meilisearch API Key 说明](./MEILISEARCH_API_KEY_说明.md) - 密钥配置详解 🔑
- 📖 [Meilisearch 完整安装指南](./MEILISEARCH_SETUP.md) - 详细配置说明
- 📖 [搜索功能验证报告](./搜索功能验证报告.md) - 功能测试结果

---

## 📁 项目结构

```
.
├── medushaV2/                    # 后端（Medusa v2）
│   ├── src/
│   │   ├── api/                  # API 路由
│   │   ├── modules/              # 自定义模块
│   │   ├── workflows/            # 工作流
│   │   └── scripts/              # 脚本
│   ├── medusa-config.ts          # Medusa 配置
│   └── package.json
│
├── medushaV2-storefront/         # 前端（Next.js 15）
│   ├── src/
│   │   ├── app/                  # App Router 页面
│   │   ├── lib/
│   │   │   ├── config/           # SDK 配置
│   │   │   ├── data/             # Server Actions
│   │   │   ├── hooks/            # React Hooks
│   │   │   └── util/             # 工具函数
│   │   └── modules/
│   │       ├── layout/           # 布局组件
│   │       ├── products/         # 产品组件
│   │       ├── search/           # 搜索组件 ⭐
│   │       └── ...
│   └── package.json
│
├── scripts/                      # 实用脚本
│   ├── start-meilisearch.sh      # Meilisearch 启动脚本
│   └── test-search-setup.sh      # 搜索配置测试脚本
│
└── docs/                         # 文档
    ├── MEILISEARCH_SETUP.md
    ├── SEARCH_QUICK_START.md
    └── README_SERVICES.md
```

---

## 🛠️ 开发命令

### 后端 (medushaV2/)
```bash
npm run dev          # 开发服务器
npm run build        # 生产构建
npm start            # 启动生产服务器
npm run seed         # 填充示例数据
npm run test:unit    # 运行单元测试
```

### 前端 (medushaV2-storefront/)
```bash
yarn dev            # 开发服务器（端口 8000，Turbopack）
yarn build          # 生产构建
yarn start          # 启动生产服务器
yarn lint           # 代码检查
yarn analyze        # 分析包大小
```

---

## 🔧 配置说明

### 环境变量

**后端 (.env)**:
```env
# 数据库
DATABASE_URL=postgres://postgres@localhost/medusa-store

# Meilisearch 搜索引擎
# 注意：MEILISEARCH_API_KEY 必须与 Meilisearch 服务的 MEILI_MASTER_KEY 一致
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs

# MinIO (可选)
MINIO_ENDPOINT=http://localhost:9000
MINIO_BUCKET=medusa-media
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# CORS
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:9000
```

**前端 (.env.local)**:
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

---

## 📚 服务管理

### 启动所有服务

**终端 1 - Meilisearch**:
```bash
./scripts/start-meilisearch.sh
```

**终端 2 - Medusa 后端**:
```bash
cd medushaV2
npm run dev
```

**终端 3 - 前端**:
```bash
cd medushaV2-storefront
yarn dev
```

### 验证服务状态

```bash
# 检查 Meilisearch
curl http://localhost:7700/health

# 检查 Medusa 后端
curl http://localhost:9000/health

# 运行完整测试
./scripts/test-search-setup.sh
```

---

## 🎯 功能路由

### 前端路由
- `/` - 首页
- `/store` - 产品列表
- `/search?q=关键词` - 搜索结果 ⭐
- `/products/[handle]` - 产品详情
- `/cart` - 购物车
- `/checkout` - 结账
- `/account` - 用户账户
- `/order/[id]` - 订单详情

### 后端 API
- `/store/products` - 产品 API
- `/store/carts` - 购物车 API
- `/store/orders` - 订单 API
- `/admin` - 管理后台 API

---

## 🧪 测试

### 运行测试

```bash
# 后端单元测试
cd medushaV2
npm run test:unit

# 后端集成测试
npm run test:integration:http

# 搜索功能测试
cd ..
./scripts/test-search-setup.sh
```

### 测试覆盖
- ✅ 搜索功能配置测试
- ✅ API 端点测试
- ✅ 组件单元测试

---

## 📖 文档索引

### 核心文档
- [README_SERVICES.md](./README_SERVICES.md) - 服务启动配置
- [AGENTS.md](./AGENTS.md) - 开发者指南

### 搜索功能文档
- [SEARCH_QUICK_START.md](./SEARCH_QUICK_START.md) - 快速启动（推荐）⭐
- [MEILISEARCH_SETUP.md](./MEILISEARCH_SETUP.md) - 完整安装指南
- [搜索功能集成说明.md](./搜索功能集成说明.md) - 集成详情
- [搜索功能验证报告.md](./搜索功能验证报告.md) - 测试报告
- [配置修复说明.md](./配置修复说明.md) - 常见问题修复

---

## 🐛 故障排查

### 搜索无结果
1. 确认 Meilisearch 正在运行：`curl http://localhost:7700/health`
2. 检查产品是否已索引：`./scripts/test-search-setup.sh`
3. 在 Admin 中编辑并保存产品以触发索引

### 后端启动失败
1. 检查数据库连接
2. 确认端口 9000 未被占用
3. 查看环境变量配置

### 前端无法连接后端
1. 确认后端正在运行
2. 检查 CORS 配置
3. 验证 `NEXT_PUBLIC_MEDUSA_BACKEND_URL`

### 更多问题
- 查看 [故障排查文档](./SEARCH_QUICK_START.md#-故障排查)
- 运行 `./scripts/test-search-setup.sh` 诊断

---

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

---

## 📄 许可证

MIT License

---

## 🔗 相关链接

- [Medusa 官方文档](https://docs.medusajs.com/v2)
- [Next.js 文档](https://nextjs.org/docs)
- [Meilisearch 文档](https://www.meilisearch.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

## 🎉 快速开始总结

```bash
# 1. 安装 Meilisearch
curl -L https://install.meilisearch.com | sh && sudo mv ./meilisearch /usr/local/bin/

# 2. 启动所有服务（3 个终端窗口）
./scripts/start-meilisearch.sh       # 终端 1
cd medushaV2 && npm run dev          # 终端 2
cd medushaV2-storefront && yarn dev  # 终端 3

# 3. 验证配置
./scripts/test-search-setup.sh

# 4. 访问应用
# 前端: http://localhost:8000
# 后端: http://localhost:9000
# Meilisearch: http://localhost:7700
```

**祝您使用愉快！** 🚀
