# 🔑 Meilisearch API Key 配置完整说明

本文档详细说明 Meilisearch API Key 在项目中的使用方式和配置方法。

---

## 📊 密钥配置概览

### 当前配置状态

| 组件 | 配置位置 | 密钥名称 | 密钥值 | 用途 |
|------|---------|---------|--------|------|
| **Meilisearch 服务** | `scripts/start-meilisearch.sh` | `MEILI_MASTER_KEY` | `aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs` | 启动服务、验证所有请求 |
| **Medusa 后端** | `medushaV2/.env` | `MEILISEARCH_API_KEY` | `aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs` | 连接 Meilisearch、索引产品 |
| **前端** | 无需配置 | - | - | 通过后端 API 搜索 |

---

## 🔐 密钥工作原理

### 架构流程图

```
┌─────────────────────────────────────────────────────────────┐
│                     搜索请求流程                              │
└─────────────────────────────────────────────────────────────┘

用户在前端搜索 "shirt"
        ↓
┌───────────────────┐
│   前端 (Next.js)  │  ❌ 不需要 Meilisearch Key
│   localhost:8000  │  ✅ 通过 Medusa API 搜索
└─────────┬─────────┘
          │ HTTP Request: GET /store/products?q=shirt
          ↓
┌───────────────────┐
│  Medusa 后端      │  ✅ 使用 MEILISEARCH_API_KEY
│  localhost:9000   │     = aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs
└─────────┬─────────┘
          │ 插件使用配置的 API Key 请求 Meilisearch
          ↓
┌───────────────────┐
│  Meilisearch      │  ✅ 验证 MEILI_MASTER_KEY
│  localhost:7700   │     = aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs
└─────────┬─────────┘
          │ ✅ 密钥匹配，返回搜索结果
          ↓
返回数据给前端显示
```

---

## 📝 详细配置说明

### 1️⃣ Meilisearch 服务端

**文件**: `scripts/start-meilisearch.sh`

```bash
# Meilisearch 主密钥（Master Key）
export MEILI_MASTER_KEY="aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs"
```

**作用**:
- 启动 Meilisearch 服务时设置主密钥
- 用于验证所有 API 请求
- 可以生成其他受限权限的 API Keys

**安全要求**:
- ✅ 至少 16 字符（推荐 32 字符）
- ✅ 包含字母、数字、特殊字符
- ✅ 随机生成，不可预测

---

### 2️⃣ Medusa 后端

**文件**: `medushaV2/.env`

```env
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs
```

**作用**:
- Medusa 插件使用此密钥连接 Meilisearch
- 执行索引操作（创建、更新、删除产品）
- 需要**完整管理权限**（因此使用 Master Key）

**配置文件**: `medushaV2/medusa-config.ts`

```typescript
plugins: [
  {
    resolve: "@rokmohar/medusa-plugin-meilisearch",
    options: {
      config: {
        host: process.env.MEILISEARCH_HOST,      // http://localhost:7700
        apiKey: process.env.MEILISEARCH_API_KEY, // 从 .env 读取
      },
      // ... 其他配置
    },
  },
]
```

---

### 3️⃣ 前端（Next.js）

**重要**：前端**不需要**也**不应该**配置 Meilisearch API Key！

**原因**:
1. **安全性**: 前端代码在浏览器中运行，任何密钥都会暴露
2. **架构设计**: 前端通过 Medusa API 搜索，不直接访问 Meilisearch
3. **权限控制**: 搜索权限由后端控制，前端无需知道 Meilisearch 密钥

**前端搜索流程**:

```typescript
// src/lib/data/search.ts
export async function searchProducts(params: SearchParams) {
  // ✅ 通过 Medusa SDK 调用后端 API
  const response = await sdk.store.product.list(queryParams, headers, next)
  
  // ❌ 不直接调用 Meilisearch
  // const response = await fetch('http://localhost:7700/indexes/products/search')
}
```

---

## 🔒 密钥一致性要求

### ⚠️ 关键规则

**必须确保密钥完全一致**：

```
MEILI_MASTER_KEY (Meilisearch) === MEILISEARCH_API_KEY (Medusa 后端)
```

### ❌ 错误示例（密钥不一致）

```bash
# scripts/start-meilisearch.sh
export MEILI_MASTER_KEY="masterKey"

# medushaV2/.env
MEILISEARCH_API_KEY=aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs
```

**结果**: Medusa 后端无法连接 Meilisearch，插件报错

### ✅ 正确示例（密钥一致）

```bash
# scripts/start-meilisearch.sh
export MEILI_MASTER_KEY="aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs"

# medushaV2/.env
MEILISEARCH_API_KEY=aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs
```

**结果**: ✅ 完美运行

---

## 🛠️ 密钥生成方法

### 方法 1: OpenSSL（推荐）

```bash
openssl rand -base64 32
```

**输出示例**:
```
aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs
```

### 方法 2: Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 方法 3: Python

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 方法 4: 在线生成器

访问: https://www.random.org/passwords/

**设置**:
- 长度: 32 字符
- 包含字母、数字、符号

---

## 🔄 更换密钥步骤

如果需要更换 Meilisearch 密钥：

### 步骤 1: 停止所有服务

```bash
# 停止 Meilisearch (Ctrl+C)
# 停止 Medusa 后端 (Ctrl+C)
```

### 步骤 2: 生成新密钥

```bash
NEW_KEY=$(openssl rand -base64 32)
echo "新密钥: $NEW_KEY"
```

### 步骤 3: 更新配置文件

**文件 1**: `scripts/start-meilisearch.sh`
```bash
export MEILI_MASTER_KEY="新密钥"
```

**文件 2**: `medushaV2/.env`
```env
MEILISEARCH_API_KEY=新密钥
```

### 步骤 4: 清除旧数据（可选）

```bash
# 删除 Meilisearch 数据目录（会清除所有索引）
rm -rf meilisearch_data/
```

### 步骤 5: 重新启动服务

```bash
# 终端 1
./scripts/start-meilisearch.sh

# 终端 2
cd medushaV2 && npm run dev
```

### 步骤 6: 验证配置

```bash
./scripts/test-search-setup.sh
```

---

## 🌍 环境配置建议

### 开发环境

**可接受的简单密钥**:
```bash
MEILI_MASTER_KEY="masterKey"
MEILISEARCH_API_KEY=masterKey
```

**优点**: 简单易记
**缺点**: 安全性低
**适用**: 本地开发、学习测试

---

### 生产环境（当前配置）✅

**强随机密钥**:
```bash
MEILI_MASTER_KEY="aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs"
MEILISEARCH_API_KEY=aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs
```

**优点**: 高安全性
**缺点**: 密钥较长，需要妥善保管
**适用**: 生产环境、预发布环境

---

## 📋 配置检查清单

使用以下清单验证配置正确性：

- [ ] **Meilisearch 启动脚本** 中的 `MEILI_MASTER_KEY` 已设置
- [ ] **Medusa 后端 .env** 中的 `MEILISEARCH_API_KEY` 已设置
- [ ] 两个密钥**完全一致**（包括大小写、标点符号）
- [ ] 密钥长度至少 16 字符（推荐 32 字符）
- [ ] 前端**没有**配置 Meilisearch 密钥
- [ ] `.env` 文件在 `.gitignore` 中（不提交到 Git）
- [ ] `.env.template` 提供了配置示例

---

## 🧪 验证配置

### 自动化测试

```bash
./scripts/test-search-setup.sh
```

**预期输出**:
```
✅ Meilisearch 认证 - 通过
✅ Medusa 后端健康检查 - 通过
✅ 产品索引 - 通过
```

### 手动验证

#### 1. 测试 Meilisearch 认证

```bash
# 使用正确的密钥（应该成功）
curl -H "Authorization: Bearer aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs" \
  http://localhost:7700/version

# 输出: {"commitSha":"...","pkgVersion":"1.35.0"}
```

```bash
# 使用错误的密钥（应该失败）
curl -H "Authorization: Bearer wrong-key" \
  http://localhost:7700/version

# 输出: {"message":"Invalid API key","code":"invalid_api_key",...}
```

#### 2. 测试 Medusa 后端连接

```bash
# 检查 Medusa 日志中是否有 Meilisearch 连接错误
cd medushaV2
npm run dev

# 应该看到：
# ✅ "Meilisearch plugin loaded successfully"
# ❌ 不应该看到: "Meilisearch connection failed"
```

---

## ❓ 常见问题

### Q1: 为什么前端不需要 Meilisearch Key？

**答**: 
- 前端通过 **Medusa Store API** 搜索，不直接访问 Meilisearch
- 搜索路径: `前端 → Medusa API → Meilisearch`
- 这样更安全，密钥不会暴露在浏览器中

---

### Q2: 可以使用不同的密钥吗？

**答**: 
- 理论上可以，但**不推荐**
- 可以在 Meilisearch 中创建受限权限的 Search API Key
- 当前配置使用 Master Key 最简单直接

---

### Q3: 忘记密钥怎么办？

**答**: 
1. 检查 `medushaV2/.env` 文件
2. 如果丢失，需要重新生成密钥并重启服务
3. 重启后会丢失所有索引数据，需要重新索引产品

---

### Q4: 密钥泄露了怎么办？

**答**: 
1. 立即更换密钥（参考"更换密钥步骤"）
2. 检查是否有未授权的索引操作
3. 如果是生产环境，考虑限制 Meilisearch 端口访问

---

## 🔗 相关文档

- [Meilisearch 认证文档](https://www.meilisearch.com/docs/learn/security/basic_security)
- [Meilisearch API Keys](https://www.meilisearch.com/docs/learn/security/master_api_keys)
- [搜索功能快速启动](./SEARCH_QUICK_START.md)
- [Meilisearch 完整安装指南](./MEILISEARCH_SETUP.md)

---

## 📞 获取帮助

如遇到密钥配置问题：

1. 运行诊断脚本: `./scripts/test-search-setup.sh`
2. 检查 Medusa 后端日志
3. 查看本文档的"常见问题"部分
4. 参考 [配置修复说明.md](./配置修复说明.md)

---

**最后更新**: 2026-02-04  
**当前密钥**: `aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs`  
**配置状态**: ✅ 已统一配置
