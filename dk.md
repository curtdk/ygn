 
#### 安装脚本
- ✅ `no

` - Meilisearch 启动脚本
  - 配置环境变量
  - 检查安装状态
  - 启动服务

#### 配置
- 端口: `7700`
- 主密钥: `masterKey`
- 环境: `development`
- 数据目录: `./meilisearch_data`


# 启动Medusa后端
cd /www/wwwroot/nextjs/ygn/medushaV2
npm run dev

# 启动前端（新终端）
cd /www/wwwroot/nextjs/ygn/medushaV2-storefront
npm run dev

关闭
pkill -f "medusa"
pkill -f "next"
pkill -f "meilisearch"