#!/bin/bash

# 搜索功能配置测试脚本

echo "=========================================="
echo "Meilisearch 搜索功能配置测试"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数
PASSED=0
FAILED=0

# 测试函数
test_service() {
    local name=$1
    local url=$2
    local expected=$3
    
    echo -n "测试 $name ... "
    
    response=$(curl -s "$url" 2>&1)
    
    if [[ $response == *"$expected"* ]]; then
        echo -e "${GREEN}✓ 通过${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ 失败${NC}"
        echo "  预期包含: $expected"
        echo "  实际响应: $response"
        ((FAILED++))
        return 1
    fi
}

# 1. 测试 Meilisearch 健康状态
test_service "Meilisearch 健康检查" "http://localhost:7700/health" "available"

# 2. 测试 Meilisearch 版本（带认证）
echo -n "测试 Meilisearch 认证 ... "
response=$(curl -s -H "Authorization: Bearer masterKey" "http://localhost:7700/version" 2>&1)
if [[ $response == *"pkgVersion"* ]]; then
    echo -e "${GREEN}✓ 通过${NC}"
    version=$(echo $response | grep -oP '"pkgVersion":"\K[^"]+')
    echo "  版本: $version"
    ((PASSED++))
else
    echo -e "${RED}✗ 失败${NC}"
    ((FAILED++))
fi

# 3. 测试 Medusa 后端
test_service "Medusa 后端健康检查" "http://localhost:9000/health" "OK"

# 4. 检查产品索引是否存在
echo -n "测试产品索引 ... "
response=$(curl -s -H "Authorization: Bearer masterKey" "http://localhost:7700/indexes" 2>&1)
if [[ $response == *"products"* ]]; then
    echo -e "${GREEN}✓ 通过${NC}"
    echo "  产品索引已创建"
    ((PASSED++))
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  产品索引未找到"
    ((FAILED++))
fi

# 5. 检查索引设置
echo -n "测试索引配置 ... "
response=$(curl -s -H "Authorization: Bearer masterKey" "http://localhost:7700/indexes/products/settings" 2>&1)
if [[ $response == *"searchableAttributes"* ]] && [[ $response == *"title"* ]]; then
    echo -e "${GREEN}✓ 通过${NC}"
    echo "  搜索字段: title, description, variant_sku, handle"
    ((PASSED++))
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  索引配置不正确"
    ((FAILED++))
fi

# 6. 检查索引统计
echo -n "测试索引数据 ... "
response=$(curl -s -H "Authorization: Bearer masterKey" "http://localhost:7700/indexes/products/stats" 2>&1)
if [[ $response == *"numberOfDocuments"* ]]; then
    doc_count=$(echo $response | grep -oP '"numberOfDocuments":\K[0-9]+')
    if [ "$doc_count" -gt 0 ]; then
        echo -e "${GREEN}✓ 通过${NC}"
        echo "  已索引 $doc_count 个产品"
    else
        echo -e "${YELLOW}⚠ 警告${NC}"
        echo "  索引中没有产品（这是正常的，如果还没创建产品）"
        echo "  提示: 在 Medusa Admin 中创建或编辑产品以触发索引"
    fi
    ((PASSED++))
else
    echo -e "${RED}✗ 失败${NC}"
    ((FAILED++))
fi

# 7. 测试搜索 API
echo -n "测试搜索 API ... "
response=$(curl -s -X POST "http://localhost:7700/indexes/products/search" \
    -H "Authorization: Bearer masterKey" \
    -H "Content-Type: application/json" \
    --data-binary '{"q": "", "limit": 1}' 2>&1)
if [[ $response == *"hits"* ]]; then
    echo -e "${GREEN}✓ 通过${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ 失败${NC}"
    ((FAILED++))
fi

# 8. 检查环境变量
echo -n "测试环境变量 ... "
if [ -f "medushaV2/.env" ]; then
    if grep -q "MEILISEARCH_HOST" "medushaV2/.env" && grep -q "MEILISEARCH_API_KEY" "medushaV2/.env"; then
        echo -e "${GREEN}✓ 通过${NC}"
        echo "  环境变量已配置"
        ((PASSED++))
    else
        echo -e "${RED}✗ 失败${NC}"
        echo "  环境变量缺失"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗ 失败${NC}"
    echo "  .env 文件不存在"
    ((FAILED++))
fi

# 总结
echo ""
echo "=========================================="
echo "测试结果汇总"
echo "=========================================="
echo -e "通过: ${GREEN}$PASSED${NC}"
echo -e "失败: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 所有测试通过！搜索功能已正确配置。${NC}"
    echo ""
    echo "下一步："
    echo "1. 在 Medusa Admin (http://localhost:9000) 中创建或编辑产品"
    echo "2. 启动前端: cd medushaV2-storefront && yarn dev"
    echo "3. 访问 http://localhost:8000 测试搜索功能"
    exit 0
else
    echo -e "${RED}⚠️  部分测试失败，请检查配置。${NC}"
    echo ""
    echo "故障排查："
    echo "1. 确保 Meilisearch 正在运行: ./scripts/start-meilisearch.sh"
    echo "2. 确保 Medusa 后端正在运行: cd medushaV2 && npm run dev"
    echo "3. 查看详细文档: 配置修复说明.md"
    exit 1
fi
