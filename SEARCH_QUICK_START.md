# 搜索功能快速启动指南

本指南将帮助您快速启动并测试项目的搜索功能。

## 📋 前置条件

- Node.js >= 20
- PostgreSQL 数据库
- Redis (可选，用于缓存)

## ✅ 配置状态

**所有配置已完成并验证：**
- ✅ Meilisearch 插件已安装
- ✅ 环境变量已配置（包括 API Key）
- ✅ medusa-config.ts 已正确配置
- ✅ 产品索引配置已优化
- ✅ API 密钥已统一配置

**密钥配置**：
- Meilisearch 和 Medusa 后端使用相同的强密钥
- 前端无需配置密钥（通过后端 API 搜索）
- 详见 [MEILISEARCH_API_KEY_说明.md](./MEILISEARCH_API_KEY_说明.md)

如遇到配置问题，请查看 [配置修复说明.md](./配置修复说明.md)

---

## 🚀 快速启动（5 分钟）

### 步骤 1: 安装并启动 Meilisearch

```bash
# 下载并安装 Meilisearch
curl -L https://install.meilisearch.com | sh
sudo mv ./meilisearch /usr/local/bin/

# 使用项目提供的启动脚本
./scripts/start-meilisearch.sh
```

启动后，您应该看到：

```
========================================
启动 Meilisearch v1.6
========================================
配置信息:
  - 地址: http://localhost:7700
  - 主密钥: aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs
  - 环境: development
  - 数据目录: ./meilisearch_data
========================================
```

> **注意**: 主密钥已配置为强随机密钥，与 Medusa 后端配置一致。

**保持此终端窗口运行**

---

### 步骤 2: 启动 Medusa 后端

打开**新的终端窗口**：

```bash
cd medushaV2
npm run dev
```

后端启动后，插件会自动：
- 连接到 Meilisearch
- 创建产品索引
- 监听产品变更事件

---

### 步骤 3: 启动前端

打开**另一个新的终端窗口**：

```bash
cd medushaV2-storefront
yarn dev
```

前端将在 `http://localhost:8000` 启动。

---

### 步骤 4: 测试搜索功能

#### 方法 1: 使用现有产品

如果数据库中已有产品：

1. 访问 Medusa Admin: `http://localhost:9000`
2. 登录后台
3. 编辑任意一个产品（例如修改标题）
4. 保存 - 这将触发 Meilisearch 索引更新

#### 方法 2: 创建新产品

1. 在 Medusa Admin 中创建一个新产品
2. 填写产品信息（标题、描述、价格等）
3. 保存产品

#### 测试前端搜索

1. 访问前端：`http://localhost:8000`
2. 在顶部导航栏找到搜索框
3. 输入产品名称关键词（至少 2 个字符）
4. 查看搜索建议下拉框
5. 点击建议或按 Enter 进入搜索结果页面

---

## 🎯 功能测试清单

### ✅ 搜索框功能

- [ ] 输入 2+ 字符显示搜索建议
- [ ] 搜索建议显示产品缩略图
- [ ] 搜索建议显示产品价格
- [ ] 点击建议跳转到产品详情页
- [ ] 按 Enter 跳转到搜索结果页面
- [ ] 清除按钮清空输入框

### ✅ 搜索历史

- [ ] 搜索后自动保存到历史记录
- [ ] 显示最近 10 条搜索记录
- [ ] 点击历史记录重新搜索
- [ ] 清除历史按钮工作正常

### ✅ 搜索结果页面

- [ ] 显示搜索关键词和结果数量
- [ ] 产品卡片正确显示
- [ ] 排序功能正常（相关性、价格、时间）
- [ ] 分页功能正常
- [ ] 空结果提示正确显示

### ✅ 键盘导航

- [ ] 上/下箭头选择搜索建议
- [ ] Enter 键跳转到选中项
- [ ] Escape 键关闭搜索建议

---

## 🔍 验证 Meilisearch 索引

### 检查索引是否创建

```bash
curl -X GET 'http://localhost:7700/indexes' \
  -H 'Authorization: Bearer masterKey'
```

应该返回：

```json
{
  "results": [
    {
      "uid": "products",
      "primaryKey": "id",
      ...
    }
  ]
}
```

### 测试搜索 API

```bash
curl -X POST 'http://localhost:7700/indexes/products/search' \
  -H 'Authorization: Bearer masterKey' \
  -H 'Content-Type: application/json' \
  --data-binary '{"q": "shirt"}'
```

---

## 🐛 故障排查

### 问题 1: 搜索无结果

**原因**: 产品未索引到 Meilisearch

**解决方案**:
1. 确保 Meilisearch 服务正在运行
2. 检查 Medusa 后端日志是否有错误
3. 在 Admin 中编辑并保存一个产品
4. 等待几秒钟让索引更新

### 问题 2: 搜索建议不显示

**原因**: 前端无法连接到后端 API

**解决方案**:
1. 打开浏览器开发者工具 (F12)
2. 查看 Console 标签是否有错误
3. 查看 Network 标签，确认 API 请求是否成功
4. 确保 Medusa 后端在 `http://localhost:9000` 运行

### 问题 3: Meilisearch 连接失败

**原因**: 环境变量配置错误或端口被占用

**解决方案**:
1. 检查 `medushaV2/.env` 中的 Meilisearch 配置
2. 确认端口 7700 未被其他程序占用
3. 重启 Meilisearch 服务

### 问题 4: 产品价格显示错误

**原因**: Region/Currency 配置问题

**解决方案**:
1. 确保产品有正确的价格设置
2. 检查当前选择的区域和货币
3. 重新索引产品

---

## 📚 搜索功能架构

```
用户输入
  ↓
SearchBox 组件 (Client)
  ↓
getSearchSuggestions() Server Action
  ↓
Medusa Store API
  ↓
Meilisearch Plugin
  ↓
Meilisearch 服务器
  ↓
返回搜索结果
```

---

## 🎨 自定义搜索

### 修改搜索字段

编辑 `medushaV2/medusa-config.ts`:

```typescript
settings: {
  products: {
    indexSettings: {
      searchableAttributes: [
        "title",           // 产品标题
        "description",     // 产品描述
        "variant_sku",     // SKU
        "handle",          // URL 链接
        // 添加更多字段...
      ],
    },
  },
},
```

### 修改过滤字段

```typescript
filterableAttributes: [
  "id",
  "title",
  "collection_id",  // 添加分类过滤
  "category_id",    // 添加品类过滤
  // 添加更多字段...
],
```

### 修改排序字段

```typescript
sortableAttributes: [
  "created_at",
  "updated_at",
  "price",  // 添加价格排序
],
```

**修改后需要重启 Medusa 后端，并重新索引产品。**

---

## 📖 更多文档

- **完整安装指南**: [MEILISEARCH_SETUP.md](./MEILISEARCH_SETUP.md)
- **服务配置指南**: [README_SERVICES.md](./README_SERVICES.md)
- **Meilisearch 官方文档**: https://www.meilisearch.com/docs
- **Medusa v2 文档**: https://docs.medusajs.com/v2

---

## ✨ 功能亮点

- ⚡ 实时搜索建议 (300ms debounce)
- 🎯 支持中文搜索
- 📱 响应式设计，支持移动端
- 🔍 多字段搜索（标题、描述、SKU）
- 📊 多种排序方式
- 📜 搜索历史记录
- ⌨️ 键盘导航支持
- 🎨 与 Medusa UI 完美集成

---

**需要帮助？** 查看 [故障排查](#-故障排查) 部分或查阅完整文档。
