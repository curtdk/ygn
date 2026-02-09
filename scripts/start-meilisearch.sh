#!/bin/bash

# Meilisearch 启动脚本
# 用于在不使用 Docker 的情况下启动 Meilisearch 服务

# 配置环境变量
# 注意：MEILI_MASTER_KEY 必须与 medushaV2/.env 中的 MEILISEARCH_API_KEY 一致
export MEILI_MASTER_KEY="aaqduqnkBiHEprjcqzr-KEfbsOoSH_5SNnY04gm-uBs"
export MEILI_ENV="development"
export MEILI_HTTP_ADDR="localhost:7700"
export MEILI_DB_PATH="./meilisearch_data"

# 检查 Meilisearch 是否已安装
if ! command -v meilisearch &> /dev/null; then
    echo "错误: Meilisearch 未安装"
    echo "请运行以下命令安装 Meilisearch:"
    echo "curl -L https://install.meilisearch.com | sh"
    exit 1
fi

echo "========================================"
echo "启动 Meilisearch v1.6"
echo "========================================"
echo "配置信息:"
echo "  - 地址: http://$MEILI_HTTP_ADDR"
echo "  - 主密钥: $MEILI_MASTER_KEY"
echo "  - 环境: $MEILI_ENV"
echo "  - 数据目录: $MEILI_DB_PATH"
echo "========================================"
echo ""
echo "按 Ctrl+C 停止服务"
echo ""

# 启动 Meilisearch
meilisearch
