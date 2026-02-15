# TypeScript 编译错误修复总结

## 修复日期
2026-02-16

## 问题描述
在运行 `npm run build` 时遇到多个 TypeScript 类型错误，主要涉及 Medusa v2 API 的类型不匹配问题。

## 修复的文件和问题

### 1. `/src/api/store/alipay/create/route.ts`
**问题**: 环境变量可能为 undefined，但 AlipaySdk 需要 string 类型

**修复**: 添加非空断言操作符 `!`
```typescript
// 修复前
appId: process.env.ALIPAY_APP_ID,

// 修复后
appId: process.env.ALIPAY_APP_ID!,
```

### 2. `/src/api/store/alipay/notify/route.ts`
**问题**:
- `updateCustomers` 方法签名改变，需要两个参数
- `updateOrders` 方法需要数组参数
- balance 类型推断为 `{}`

**修复**:
```typescript
// 修复前
const credits = order.metadata?.credits || 0
const currentBalance = customer.metadata?.balance || 0
await customerService.updateCustomers({
  id: customerId,
  metadata: { ... }
})
await orderService.updateOrders({
  id: orderId,
  metadata: { ... }
})

// 修复后
const credits = (order.metadata?.credits as number) || 0
const currentBalance = (customer.metadata?.balance as number) || 0
await customerService.updateCustomers(customerId, {
  metadata: { ... }
})
await orderService.updateOrders([{
  id: orderId,
  metadata: { ... }
}])
```

### 3. `/src/api/store/recharge/create/route.ts`
**问题**: `updateOrders` 方法需要数组参数

**修复**:
```typescript
// 修复前
await orderService.updateOrders({
  id: order.id,
  metadata: { ... }
})

// 修复后
await orderService.updateOrders([{
  id: order.id,
  metadata: { ... }
}])
```

### 4. `/src/api/store/recharge/history/route.ts`
**问题**:
- `listOrders` 的 filters 参数格式不正确
- 重复声明 `rechargeOrders` 变量

**修复**:
```typescript
// 修复前
const orders = await orderService.listOrders({
  filters: {
    customer_id: customerId,
    "metadata.type": "recharge"
  },
  order: { created_at: "DESC" }
})

// 修复后
const orders = await orderService.listOrders({
  customer_id: customerId
}, {
  order: { created_at: "DESC" }
})

// 过滤出充值订单
const rechargeOrders = orders.filter((order: any) => order.metadata?.type === "recharge")
```

### 5. `/src/api/store/video-generation/route.ts`
**问题**:
- `ProductVariantDTO` 没有 `calculated_price` 或 `prices` 属性
- `updateCustomers` 方法签名改变
- balance 类型推断为 `{}`

**修复**:
```typescript
// 修复前
const price = variant?.calculated_price?.calculated_amount || 0
const balance = customer.metadata?.balance || 0
await customerService.updateCustomers({
  id: customerId,
  metadata: { ... }
})

// 修复后
// 从产品 metadata 中获取价格
const price = (product.metadata?.price as number) || 1000
const balance = (customer.metadata?.balance as number) || 0
await customerService.updateCustomers(customerId, {
  metadata: { ... }
})
```

## Medusa v2 API 变更总结

### 1. Customer Service
```typescript
// 旧 API
customerService.updateCustomers({ id, metadata })

// 新 API
customerService.updateCustomers(customerId, { metadata })
```

### 2. Order Service
```typescript
// 旧 API
orderService.updateOrders({ id, metadata })

// 新 API
orderService.updateOrders([{ id, metadata }])

// 旧 API
orderService.listOrders({ filters: {...}, order: {...} })

// 新 API
orderService.listOrders({ customer_id }, { order: {...} })
```

### 3. Product Variant 价格
在 Medusa v2 中，产品价格需要通过 pricing 模块单独查询，或者存储在产品的 metadata 中。

## 类型安全建议

1. **使用类型断言**: 当从 metadata 中获取数据时，使用 `as number` 等类型断言
2. **非空断言**: 对于确定存在的环境变量，使用 `!` 操作符
3. **默认值**: 始终提供默认值以避免 undefined 错误

## 构建结果
✅ 所有 TypeScript 错误已修复
✅ 后端构建成功
✅ 前端构建成功

## 后续建议

1. **产品价格管理**: 考虑在产品创建时将价格存储在 metadata 中，或者实现专门的价格查询逻辑
2. **类型定义**: 为 metadata 创建 TypeScript 接口以提高类型安全性
3. **环境变量验证**: 在应用启动时验证所有必需的环境变量

## 相关文件
- `/www/wwwroot/nextjs/ygn/medushaV2/src/api/store/alipay/create/route.ts`
- `/www/wwwroot/nextjs/ygn/medushaV2/src/api/store/alipay/notify/route.ts`
- `/www/wwwroot/nextjs/ygn/medushaV2/src/api/store/recharge/create/route.ts`
- `/www/wwwroot/nextjs/ygn/medushaV2/src/api/store/recharge/history/route.ts`
- `/www/wwwroot/nextjs/ygn/medushaV2/src/api/store/video-generation/route.ts`
