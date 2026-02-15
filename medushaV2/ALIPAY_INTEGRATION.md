# 支付宝支付集成文档

## 概述

本项目已集成支付宝手机网站支付（H5支付），支持在移动端浏览器中完成支付。

## 配置步骤

### 1. 获取支付宝应用凭证

1. 登录 [支付宝开放平台](https://open.alipay.com/)
2. 创建应用或选择现有应用
3. 获取以下信息：
   - **APPID**：应用ID
   - **应用私钥**：用于签名
   - **支付宝公钥**：用于验签

### 2. 配置环境变量

在 `.env` 文件中配置以下参数：

```env
# 支付宝配置
ALIPAY_APP_ID=your_app_id_here                    # 替换为你的APPID
ALIPAY_PRIVATE_KEY=your_private_key_here          # 替换为你的应用私钥
ALIPAY_PUBLIC_KEY=your_alipay_public_key_here    # 替换为支付宝公钥
ALIPAY_RETURN_URL=http://localhost:8000/payment/return  # 支付完成后跳转地址
ALIPAY_NOTIFY_URL=http://your-domain.com/store/alipay/notify  # 异步通知地址（需要公网可访问）
FRONTEND_URL=http://localhost:8000
BACKEND_URL=http://localhost:9000
```

**重要提示**：
- `ALIPAY_PRIVATE_KEY` 和 `ALIPAY_PUBLIC_KEY` 需要去掉头尾的 `-----BEGIN/END PRIVATE KEY-----`
- 私钥和公钥应该是一行字符串，不包含换行符
- `ALIPAY_NOTIFY_URL` 必须是公网可访问的地址，本地测试可以使用 ngrok 等工具

### 3. 密钥格式说明

**应用私钥格式**：
```
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...（一行完整的字符串）
```

**支付宝公钥格式**：
```
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...（一行完整的字符串）
```

## API 端点

### 1. 创建支付订单

**接口**: `POST /store/alipay/create`

**请求参数**:
```json
{
  "order_id": "ORDER_123456",
  "amount": "0.01",
  "subject": "视频生成服务",
  "body": "订单描述"
}
```

**响应**:
```json
{
  "success": true,
  "payment_url": "https://openapi.alipay.com/gateway.do?...",
  "out_trade_no": "ORDER_123456_1234567890"
}
```

### 2. 查询订单状态

**接口**: `GET /store/alipay/query?out_trade_no=xxx`

**响应**:
```json
{
  "success": true,
  "data": {
    "trade_status": "TRADE_SUCCESS",
    "total_amount": "0.01",
    ...
  }
}
```

### 3. 支付回调（异步通知）

**接口**: `POST /store/alipay/notify`

此接口由支付宝服务器调用，用于通知支付结果。

## 测试步骤

### 1. 安装依赖

```bash
cd /www/wwwroot/nextjs/ygn/medushaV2
npm install
```

### 2. 构建项目

```bash
npm run build
```

### 3. 启动服务

```bash
npm run dev
```

### 4. 运行测试脚本

```bash
node test-alipay.js
```

测试脚本会：
1. 创建一个测试订单（金额0.01元）
2. 生成支付URL
3. 等待你完成支付
4. 查询订单状态

### 5. 手动测试

使用 curl 或 Postman 测试：

```bash
# 创建支付订单
curl -X POST http://localhost:9000/store/alipay/create \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "TEST_001",
    "amount": "0.01",
    "subject": "测试订单"
  }'

# 查询订单状态
curl "http://localhost:9000/store/alipay/query?out_trade_no=TEST_001_1234567890"
```

## 集成到业务流程

### 视频生成支付流程

1. 用户点击"生成视频"
2. 前端调用 `/store/alipay/create` 创建支付订单
3. 跳转到支付宝支付页面（`payment_url`）
4. 用户完成支付
5. 支付宝回调 `/store/alipay/notify`
6. 更新订单状态，扣除积分，触发视频生成

### 前端集成示例

```typescript
// 创建支付订单
const response = await fetch('/store/alipay/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    order_id: videoId,
    amount: '9.90',
    subject: '视频生成服务',
    body: `生成视频 - ${productTitle}`
  })
})

const { payment_url } = await response.json()

// 跳转到支付页面
window.location.href = payment_url
```

## 注意事项

1. **沙箱环境**：开发测试时使用支付宝沙箱环境
   - 沙箱网关：`https://openapi.alipaydev.com/gateway.do`
   - 在 `alipay.ts` 中修改 `gateway` 参数

2. **生产环境**：
   - 确保 `ALIPAY_NOTIFY_URL` 是公网可访问的HTTPS地址
   - 在支付宝开放平台配置回调地址白名单

3. **安全性**：
   - 私钥不要提交到代码仓库
   - 使用环境变量管理敏感信息
   - 验证所有回调签名

4. **金额格式**：
   - 金额单位为元，保留两位小数
   - 示例：`"0.01"`, `"9.90"`, `"100.00"`

## 故障排查

### 问题1：签名验证失败

- 检查私钥和公钥格式是否正确
- 确认使用的是应用私钥，不是支付宝公钥
- 检查密钥是否包含换行符或空格

### 问题2：回调接收不到

- 确认 `ALIPAY_NOTIFY_URL` 是公网可访问的
- 检查服务器防火墙设置
- 查看支付宝开放平台的通知日志

### 问题3：支付后跳转失败

- 检查 `ALIPAY_RETURN_URL` 配置
- 确认前端路由正确处理返回参数

## 相关文件

- `/src/services/alipay.ts` - 支付宝服务类
- `/src/api/store/alipay/create/route.ts` - 创建支付订单
- `/src/api/store/alipay/notify/route.ts` - 支付回调处理
- `/src/api/store/alipay/query/route.ts` - 查询订单状态
- `/test-alipay.js` - 测试脚本
- `/.env` - 环境变量配置

## 参考文档

- [支付宝开放平台](https://open.alipay.com/)
- [手机网站支付文档](https://opendocs.alipay.com/open/203/105288)
- [alipay-sdk npm包](https://www.npmjs.com/package/alipay-sdk)
