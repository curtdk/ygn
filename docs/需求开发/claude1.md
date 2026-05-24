现在写使用说明文档给你。

  ---
  服务产品功能使用说明
  
  ▎ 启动服务：cd medushaV2 && npm run dev（后端 http://localhost:9000）
  ▎ 启动前端：cd medushaV2-storefront && yarn dev（前端 http://localhost:8000）
  ▎ Admin 后台：http://localhost:9000/app

  ---
  ⚠️  首次使用前：运行数据库迁移
  
  cd medushaV2
  npx medusa migrations run

  ---
  一、消费者（普通用户）

  1. 浏览服务产品

  入口： 前端顶部导航栏 → "服务" → 默认打开"服务产品"Tab

  页面地址：/[countryCode]/service

  显示所有已上架服务产品，点击卡片可查看详情和购买。

  ---
  2. 查看我的服务订单

  入口： /service 页面 → 点击"我的订单"Tab

  - 显示订单状态（待接单 / 已接单 / 服务中 / 已完成 / 已取消）
  - 显示服务地址、预约日期
  - 点击订单卡片进入订单详情

  ---
  3. 确认服务完成 & 评价
  
  入口： "我的订单"→ 点击状态为"服务中"的订单

  - 点击"确认完成"按钮 → 订单变为"已完成"
  - 完成后点击"评价服务"→ 选择 1~5 星 + 填写文字评价 → 提交

  ---
  4. 申请成为服务商

  入口： 前端"个人中心" → "服务商申请"
  页面地址：/[countryCode]/account/service-provider

  填写手机号、上传身份证正反面、工作证件、荣誉证书 → 提交等待审核。

  ---
  5. 分销中心 / 分润记录

  入口： 个人中心 → "分销中心"
  页面地址：/[countryCode]/account/distribution

  - 查看推荐码和下级团队
  - 查看分润收益记录

  ---
  二、服务商（已认证的服务人员）

  1. 查看抢单池 & 抢单

  入口： /service 页面 → 点击"服务商接单"Tab → 默认显示"抢单池"子Tab

  - 显示所有待接、未分配的订单（地址、日期、状态）
  - 点击"立即抢单"按钮 → 成功后订单归入"我的接单"

  ---
  2. 管理我的接单
  
  入口： "服务商接单"Tab → 点击"我的接单"子Tab

  - 显示已接单、服务中、已完成的订单
  - 状态"已接单"：点击订单 → "上传到场凭证 / 开始服务"→ 上传现场照片 → 订单变为"服务中"
  - 状态"服务中"：点击订单 → "提交服务结果"→ 上传结果图片 → 订单变为"已完成"

  ---
  3. 查看佣金收益
  
  入口： 个人中心 → "分销中心"（或 /account/distribution）

  查看服务佣金收益、结算记录。

  ---
  4. 接单模式设置

  入口： 个人中心 → "接单模式"
  页面地址：/[countryCode]/account/order-mode

  ---
  三、平台管理员（Admin 后台）

  ▎ 入口：http://localhost:9000/app

  1. 服务管理中心（Widget）

  位置： Admin 后台 → 订单列表页（Orders）→ 页面底部"服务管理中心" Widget

  Widget 包含三个 Tab：

  Tab 1：资质审核

  - 查看所有服务商申请（姓名、手机号、状态）
  - 点击"通过"审核申请 → 用户获得服务商权限
  - 点击"拒绝"驳回申请

  Tab 2：服务订单

  - 查看全部服务订单（状态、客户、服务商、服务地址）
  - 点击"审核通过"将 pending 订单放入抢单池
  - 点击"指派"输入服务商 ID 强制指派订单
  - 点击"取消"取消订单

  Tab 3：全局配置

  设置并保存以下参数：

  ┌──────────────────┬────────────────────────────────┐
  │      配置项      │              说明              │
  ├──────────────────┼────────────────────────────────┤
  │ 订单审核模式     │ 自动审核 / 人工审核            │
  ├──────────────────┼────────────────────────────────┤
  │ 派单模式         │ 抢单模式 / 人工指派 / 自动派单 │
  ├──────────────────┼────────────────────────────────┤
  │ 佣金结算模式     │ 自动结算 / 手动审核结算        │
  ├──────────────────┼────────────────────────────────┤
  │ 订单自动完结时长 │ 默认 72 小时                   │
  ├──────────────────┼────────────────────────────────┤
  │ 默认佣金比例     │ 百分比                         │
  ├──────────────────┼────────────────────────────────┤
  │ 平台手续费       │ 百分比                         │
  ├──────────────────┼────────────────────────────────┤
  │ 三级分润开关     │ 每级可单独开关                 │
  └──────────────────┴────────────────────────────────┘

  ---
  2. 服务产品管理 API
  
  目前没有前端 UI，可通过 API 操作：

  # 创建服务产品
  POST /admin/service-products
  {
    "title": "上门摄影服务",
    "service_type": "photography",
    "description": "专业摄影师上门服务",
    "image_url": "https://...",
    "commission_rate": 0.10,
    "profit_sharing_level1": 0.10,
    "profit_sharing_level2": 0.05,
    "profit_sharing_level3": 0.02
  }

  # 查询服务产品列表
  GET /admin/service-products

  # 查询服务订单列表
  GET /admin/service-orders?status=pending&limit=20

  # 对订单执行操作（审核通过/指派/取消）
  POST /admin/service-orders/{id}
  { "action": "approve" }
  { "action": "assign", "provider_id": "xxx" }
  { "action": "cancel" }

  ---
  3. 分润操作

  手动执行多级分润（后台 API）：

  POST /admin/profit-sharing
  {
    "order_id": "服务订单ID",
    "order_amount": 100,
    "profit_sharing_level1": 0.10,
    "profit_sharing_level2": 0.05,
    "profit_sharing_level3": 0.02,
    "dry_run": false
  # 查询服务产品列表
  GET /admin/service-products

  # 查询服务订单列表
  GET /admin/service-orders?status=pending&limit=20

  # 对订单执行操作（审核通过/指派/取消）
  POST /admin/service-orders/{id}
  { "action": "approve" }
  { "action": "assign", "provider_id": "xxx" }
  { "action": "cancel" }

  ---
  3. 分润操作

  手动执行多级分润（后台 API）：

  POST /admin/profit-sharing
  {
    "order_id": "服务订单ID",
    "order_amount": 100,
    "profit_sharing_level1": 0.10,
    "profit_sharing_level2": 0.05,
    "profit_sharing_level3": 0.02,
    "dry_run": false
  }

  设置 dry_run: true 可预览分润金额不实际发放。

  查看分润记录：
  GET /admin/profit-sharing?referrer_id=xxx

  ---
  四、完整订单流程图

  消费者下单 → 待接单(pending)
      ↓ 审核通过（后台 or 自动）
  进入抢单池
      ↓ 服务商抢单 / 后台指派
  已接单(accepted)
      ↓ 服务商上传到场凭证
  服务中(in_progress)
      ↓ 服务商提交结果 or 消费者确认
  已完成(completed)
      ↓ 消费者评价（1-5星）
      ↓ 后台执行佣金结算 & 分润
  结束

  ---
  五、注意事项

  1. 首次运行必须执行 npx medusa migrations run，否则数据库表结构缺失
  2. 服务商抢单需要用户已通过资质审核（status=approved）
  3. 全局配置（service-settings）现在已持久化到数据库，重启不丢失
  4. 分润记录存储在 commission 表，commission_type="service"