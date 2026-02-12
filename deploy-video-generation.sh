#!/bin/bash

# 视频生成功能快速部署脚本

echo "========================================="
echo "忆时光视频生成功能部署"
echo "========================================="
echo ""

# 检查是否在正确的目录
if [ ! -d "medushaV2" ]; then
  echo "错误: 请在项目根目录运行此脚本"
  exit 1
fi

# 步骤1: 构建Medusa项目
echo "步骤1: 构建Medusa项目..."
cd medushaV2
npm run build

if [ $? -ne 0 ]; then
  echo "错误: 构建失败"
  exit 1
fi

# 步骤2: 生成数据库迁移
echo ""
echo "步骤2: 生成数据库迁移..."
npx medusa db:generate

if [ $? -ne 0 ]; then
  echo "警告: 迁移生成失败，可能需要手动创建"
fi

# 步骤3: 运行数据库迁移
echo ""
echo "步骤3: 运行数据库迁移..."
npx medusa db:migrate

if [ $? -ne 0 ]; then
  echo "错误: 数据库迁移失败"
  echo "请检查数据库连接配置"
  exit 1
fi

# 步骤4: 验证表创建
echo ""
echo "步骤4: 验证数据库表..."
echo "请手动检查以下表是否创建成功:"
echo "  - video_material"
echo "  - user_video"
echo ""

# 步骤5: 启动服务
echo "步骤5: 准备启动服务..."
echo ""
echo "部署完成！"
echo ""
echo "下一步操作:"
echo "1. 启动Medusa服务: npm run dev"
echo "2. 访问Admin: http://localhost:9000/app"
echo "3. 创建产品并配置视频素材"
echo "4. 在前端集成API调用"
echo ""
echo "详细文档请查看: 视频生成功能使用指南.md"
echo "========================================="

cd ..
