# 忆时光视频生成业务 - 完整实施包

## 📋 概述

本项目为忆时光（ygn）项目的Medusa底部模型增加了用户生成视频业务功能。用户可以选择视频生成产品，替换素材（如照片、音乐等），生成个性化的回忆视频。

## 🎯 核心功能

1. **产品类型扩展**：支持"生成视频"和"普通产品"两种类型
2. **素材管理**：为视频产品配置可替换素材（图片、声音、背景、视频）
3. **素材替换**：用户可以上传自己的照片替换默认素材
4. **视频生成**：提交生成请求，扣除积分，创建订单
5. **视频管理**：在"我的回忆"中查看生成的视频

## 📦 已完成的工作

### ✅ 后端模块
- `video-material` 模块：管理产品的可替换素材
- `user-video` 模块：管理用户生成的视频记录

### ✅ API路由
- Store API：供前端调用（获取素材、创建视频、查询视频）
- Admin API：供后台管理（素材CRUD操作）

### ✅ Admin UI
- 视频素材管理Widget：在产品详情页配置素材

### ✅ 工作流
- 视频生成工作流框架（具体逻辑待实现）

### ✅ 文档
- 完整的技术方案和使用指南
- 前端集成示例代码
- 数据库迁移说明
- 快速参考文档

## 📚 文档索引

| 文档 | 说明 | 适用对象 |
|------|------|----------|
| [快速参考.md](./快速参考.md) | 快速查阅的参考卡片 | 所有人 |
| [实施总结.md](./实施总结.md) | 项目实施总结和进度 | 项目经理 |
| [视频生成业务实现方案.md](./视频生成业务实现方案.md) | 完整的技术方案 | 开发人员 |
| [视频生成功能使用指南.md](./视频生成功能使用指南.md) | 使用和部署指南 | 运维人员 |
| [数据库迁移说明.md](./数据库迁移说明.md) | 数据库操作说明 | DBA |
| [前端API集成示例.tsx](./前端API集成示例.tsx) | React集成代码 | 前端开发 |
| [项目结构.txt](./项目结构.txt) | 项目文件结构 | 所有人 |

## 🚀 快速开始

### 1. 部署后端

```bash
# 运行部署脚本
cd /www/wwwroot/nextjs/ygn
chmod +x deploy-video-generation.sh
./deploy-video-generation.sh
```

### 2. 启动服务

```bash
cd medushaV2
npm run dev
```

### 3. 访问Admin

打开浏览器访问：http://localhost:9000/app

### 4. 配置产品

1. 登录Admin
2. 创建或编辑产品
3. 在产品详情页找到"视频可替换素材"部分
4. 添加素材配置

## 🔌 API端点

### Store API（前端使用）

```bash
# 获取产品素材
GET /store/products/{id}/materials

# 创建视频生成任务
POST /store/video-generation

# 获取用户视频列表
GET /store/my-videos
```

### Admin API（后台管理）

```bash
# 素材管理
GET    /admin/video-materials
POST   /admin/video-materials
POST   /admin/video-materials/{id}
DELETE /admin/video-materials/{id}
```

## 📊 数据库结构

### video_material 表
存储产品的可替换素材配置

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 主键 |
| product_id | string | 产品ID |
| name | string | 素材名称 |
| material_key | string | 素材标识 |
| material_type | enum | 类型（image/audio/background/video） |
| default_url | string | 默认素材URL |
| is_replaceable | boolean | 是否可替换 |
| sort_order | number | 排序 |

### user_video 表
存储用户生成的视频记录

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 主键 |
| user_id | string | 用户ID |
| order_id | string | 订单ID |
| product_id | string | 产品ID |
| video_url | string | 视频URL |
| thumbnail_url | string | 缩略图URL |
| title | string | 标题 |
| duration | number | 时长（秒） |
| status | enum | 状态（pending/processing/completed/failed） |
| materials_used | json | 使用的素材 |
| error_message | string | 错误信息 |

## 💻 前端集成

### 安装依赖（如果需要）

```bash
cd react
npm install
```

### 使用示例

```typescript
import { useProductMaterials, createVideoGeneration } from './api'

// 获取产品素材
const { materials, loading } = useProductMaterials(productId)

// 创建视频
await createVideoGeneration({
  product_id: productId,
  title: "我的视频",
  materials_used: {...}
})
```

详细代码请查看 [前端API集成示例.tsx](./前端API集成示例.tsx)

## ⚠️ 待实现功能

### 🔴 高优先级（必须完成）

1. **积分系统集成**
   - 检查用户积分余额
   - 扣除视频生成所需积分
   - 记录积分交易

2. **订单系统集成**
   - 创建视频生成订单
   - 关联产品和价格
   - 订单状态管理

3. **视频生成服务**
   - 集成AI视频生成API
   - 处理素材上传和转换
   - 视频渲染和合成

4. **文件存储**
   - 配置OSS服务（阿里云OSS/AWS S3）
   - 实现文件上传接口
   - CDN加速配置

### 🟡 中优先级（重要）

5. **工作流完善**
   - 完善视频生成工作流
   - 添加错误处理和重试
   - 集成任务队列

6. **通知系统**
   - 视频生成完成通知
   - 生成失败通知

7. **前端页面修改**
   - 修改Home.tsx
   - 修改ConfigureRole.tsx
   - 修改GenerateVideo.tsx
   - 修改Memories.tsx

## 🛠️ 技术栈

### 后端
- Medusa v2 - 电商框架
- MikroORM - ORM
- PostgreSQL/MySQL - 数据库
- Node.js + TypeScript

### 前端
- React + TypeScript
- React Router
- Tailwind CSS
- Medusa UI (Admin)

### 待集成
- 阿里云OSS / AWS S3 - 文件存储
- Runway ML / D-ID / HeyGen - 视频生成
- Bull / BullMQ - 任务队列
- Redis - 缓存

## 🐛 故障排查

### 问题1: 模块未找到
**错误**: `Cannot resolve module "videoMaterialModuleService"`

**解决**:
```bash
# 检查 medusa-config.ts 中是否注册模块
# 重新构建项目
cd medushaV2
npm run build
```

### 问题2: 数据库表不存在
**错误**: `relation "video_material" does not exist`

**解决**:
```bash
cd medushaV2
npx medusa db:migrate
```

### 问题3: API 404错误
**错误**: `Cannot GET /store/products/xxx/materials`

**解决**:
- 检查路由文件路径是否正确
- 确保文件名为 `route.ts`
- 重新构建项目

更多问题请查看 [视频生成功能使用指南.md](./视频生成功能使用指南.md)

## 📁 项目结构

```
ygn/
├── medushaV2/                    # Medusa后端
│   ├── src/
│   │   ├── modules/              # 自定义模块
│   │   │   ├── video-material/   # ✨ 素材管理
│   │   │   └── user-video/       # ✨ 用户视频
│   │   ├── api/                  # API路由
│   │   │   ├── store/            # ✨ 前端API
│   │   │   └── admin/            # ✨ 后台API
│   │   ├── admin/widgets/        # ✨ Admin组件
│   │   └── workflows/            # ✨ 工作流
│   └── medusa-config.ts          # ✨ 已更新
│
├── react/                        # React前端
│   └── src/pages/                # 需修改的页面
│
└── 文档/                         # 完整文档
    ├── 快速参考.md
    ├── 实施总结.md
    ├── 视频生成业务实现方案.md
    ├── 视频生成功能使用指南.md
    ├── 数据库迁移说明.md
    ├── 前端API集成示例.tsx
    └── 项目结构.txt
```

## 🧪 测试

### 测试素材管理

```bash
# 创建素材
curl -X POST http://localhost:9000/admin/video-materials \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_01",
    "name": "角色1",
    "material_key": "character_1",
    "material_type": "image",
    "default_url": "/assets/sister.pic",
    "is_replaceable": true,
    "sort_order": 1
  }'

# 获取素材列表
curl http://localhost:9000/store/products/prod_01/materials
```

### 测试视频生成

```bash
# 创建视频生成任务
curl -X POST http://localhost:9000/store/video-generation \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_01",
    "title": "测试视频",
    "materials_used": {
      "character_1": {
        "original_url": "/assets/sister.pic",
        "replaced_url": "/uploads/test.jpg",
        "type": "image"
      }
    }
  }'
```

## 📞 获取帮助

如有问题，请查看：
- **快速问题**：[快速参考.md](./快速参考.md)
- **技术细节**：[视频生成业务实现方案.md](./视频生成业务实现方案.md)
- **使用说明**：[视频生成功能使用指南.md](./视频生成功能使用指南.md)
- **代码示例**：[前端API集成示例.tsx](./前端API集成示例.tsx)

## 📝 更新日志

### 2024-02-12
- ✅ 创建video-material和user-video模块
- ✅ 实现Store和Admin API路由
- ✅ 创建Admin Widget组件
- ✅ 编写完整文档和示例代码
- ✅ 创建部署脚本
- ⏳ 待实现：积分系统、订单系统、视频生成服务

## 📄 许可证

本项目为忆时光（ygn）项目的一部分。

---

**开始使用**: 查看 [快速参考.md](./快速参考.md)

**详细文档**: 查看 [视频生成功能使用指南.md](./视频生成功能使用指南.md)
