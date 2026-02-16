#!/bin/bash

# Medusa 项目管理脚本
# 用于快速启动、停止、重启服务

PROJECT_DIR="/www/wwwroot/nextjs/ygn"
cd $PROJECT_DIR

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 显示帮助信息
show_help() {
    echo "Medusa 项目管理脚本"
    echo ""
    echo "用法: ./manage.sh [命令]"
    echo ""
    echo "命令:"
    echo "  start       启动所有服务"
    echo "  stop        停止所有服务"
    echo "  restart     重启所有服务"
    echo "  status      查看服务状态"
    echo "  logs        查看日志"
    echo "  build       构建项目"
    echo "  deploy      部署到生产环境"
    echo "  help        显示帮助信息"
    echo ""
}

# 启动服务
start_services() {
    echo -e "${GREEN}启动 Medusa 服务...${NC}"

    # 创建日志目录
    mkdir -p $PROJECT_DIR/logs

    # 创建 admin 符号链接
    echo -e "${YELLOW}创建 admin 符号链接...${NC}"
    cd $PROJECT_DIR/medushaV2
    mkdir -p public
    ln -sf "$(pwd)/.medusa/server/public/admin" public/admin
    echo -e "${GREEN}符号链接创建完成${NC}"

    # 启动服务
    cd $PROJECT_DIR
    pm2 start ecosystem.config.js

    echo -e "${GREEN}服务启动完成！${NC}"
    pm2 status
}

# 停止服务
stop_services() {
    echo -e "${YELLOW}停止 Medusa 服务...${NC}"
    pm2 stop all
    echo -e "${GREEN}服务已停止${NC}"
}

# 重启服务
restart_services() {
    echo -e "${YELLOW}重启 Medusa 服务...${NC}"
    pm2 restart all
    echo -e "${GREEN}服务重启完成！${NC}"
    pm2 status
}

# 查看状态
show_status() {
    echo -e "${GREEN}=== PM2 服务状态 ===${NC}"
    pm2 status
    echo ""
    echo -e "${GREEN}=== Nginx 状态 ===${NC}"
    sudo systemctl status nginx --no-pager
}

# 查看日志
show_logs() {
    echo -e "${GREEN}查看服务日志（按 Ctrl+C 退出）${NC}"
    pm2 logs
}

# 构建项目
build_project() {
    echo -e "${GREEN}构建后端项目...${NC}"
    cd $PROJECT_DIR/medushaV2
    npm run build

    echo -e "${GREEN}构建前端项目...${NC}"
    cd $PROJECT_DIR/medushaV2-storefront
    npm run build

    echo -e "${GREEN}构建完成！${NC}"
}

# 部署到生产环境
deploy_production() {
    echo -e "${YELLOW}开始部署到生产环境...${NC}"

    # 1. 停止服务
    echo -e "${YELLOW}1. 停止当前服务...${NC}"
    pm2 stop all

    # 2. 拉取最新代码（如果使用 Git）
    echo -e "${YELLOW}2. 更新代码...${NC}"
    cd $PROJECT_DIR/medushaV2
    git pull origin main
    cd $PROJECT_DIR/medushaV2-storefront
    git pull origin main

    # 3. 安装依赖
    echo -e "${YELLOW}3. 安装依赖...${NC}"
    cd $PROJECT_DIR/medushaV2
    npm install --production
    cd $PROJECT_DIR/medushaV2-storefront
    npm install --production

    # 4. 构建项目
    echo -e "${YELLOW}4. 构建项目...${NC}"
    build_project

    # 5. 数据库迁移
    echo -e "${YELLOW}5. 运行数据库迁移...${NC}"
    cd $PROJECT_DIR/medushaV2
    npm run build

    # 6. 创建 admin 符号链接
    echo -e "${YELLOW}6. 创建 admin 符号链接...${NC}"
    cd $PROJECT_DIR/medushaV2
    mkdir -p public
    ln -sf "$(pwd)/.medusa/server/public/admin" public/admin
    echo -e "${GREEN}符号链接创建完成${NC}"

    # 7. 启动服务
    echo -e "${YELLOW}7. 启动服务...${NC}"
    cd $PROJECT_DIR
    pm2 start ecosystem.config.js
    pm2 save

    # 7. 重启 Nginx
    echo -e "${YELLOW}7. 重启 Nginx...${NC}"
    sudo systemctl reload nginx

    echo -e "${GREEN}部署完成！${NC}"
    pm2 status
}

# 主逻辑
case "$1" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    build)
        build_project
        ;;
    deploy)
        deploy_production
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}错误: 未知命令 '$1'${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
