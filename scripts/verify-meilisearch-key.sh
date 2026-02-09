#!/bin/bash

# Meilisearch 密钥一致性验证脚本

echo "=========================================="
echo "Meilisearch 密钥配置验证"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 读取启动脚本中的密钥
SCRIPT_KEY=$(grep 'MEILI_MASTER_KEY=' scripts/start-meilisearch.sh | grep -oP '".*?"' | tr -d '"')
echo "启动脚本密钥:"
echo "  $SCRIPT_KEY"
echo ""

# 2. 读取 .env 中的密钥
if [ -f "medushaV2/.env" ]; then
    ENV_KEY=$(grep 'MEILISEARCH_API_KEY=' medushaV2/.env | cut -d'=' -f2)
    echo "Medusa 后端密钥:"
    echo "  $ENV_KEY"
    echo ""
else
    echo -e "${RED}错误: medushaV2/.env 文件不存在${NC}"
    exit 1
fi

# 3. 比较密钥
echo "=========================================="
if [ "$SCRIPT_KEY" == "$ENV_KEY" ]; then
    echo -e "${GREEN}✅ 密钥配置一致！${NC}"
    echo ""
    echo "两个密钥完全匹配："
    echo "  $SCRIPT_KEY"
else
    echo -e "${RED}❌ 密钥配置不一致！${NC}"
    echo ""
    echo "启动脚本: $SCRIPT_KEY"
    echo "后端配置: $ENV_KEY"
    echo ""
    echo "请确保两个密钥完全一致。"
    exit 1
fi
echo "=========================================="
echo ""

# 4. 测试当前运行的 Meilisearch
if curl -s http://localhost:7700/health > /dev/null 2>&1; then
    echo "测试当前 Meilisearch 服务..."
    
    # 测试使用脚本密钥
    response=$(curl -s -H "Authorization: Bearer $SCRIPT_KEY" http://localhost:7700/version 2>&1)
    if echo "$response" | grep -q "pkgVersion"; then
        echo -e "${GREEN}✅ 使用脚本密钥成功${NC}"
        version=$(echo "$response" | grep -oP '"pkgVersion":"\K[^"]+')
        echo "  Meilisearch 版本: $version"
    else
        echo -e "${RED}❌ 使用脚本密钥失败${NC}"
        echo "  响应: $response"
        echo ""
        echo -e "${YELLOW}提示: 当前运行的 Meilisearch 可能使用了不同的密钥${NC}"
        echo "  请重启 Meilisearch 服务使新密钥生效"
    fi
else
    echo -e "${YELLOW}⚠ Meilisearch 服务未运行${NC}"
    echo "  请运行: ./scripts/start-meilisearch.sh"
fi

echo ""
echo "=========================================="
echo "建议："
echo "1. 确保密钥一致后，重启 Meilisearch："
echo "   - 停止当前服务 (Ctrl+C)"
echo "   - 运行: ./scripts/start-meilisearch.sh"
echo ""
echo "2. 重启 Medusa 后端："
echo "   - cd medushaV2 && npm run dev"
echo ""
echo "3. 运行完整测试："
echo "   - ./scripts/test-search-setup.sh"
echo "=========================================="
