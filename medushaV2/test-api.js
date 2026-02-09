const fetch = require('node-fetch');

async function testAPI() {
  const backendUrl = 'http://localhost:9000';
  const apiKey = 'apk_01KGFMBC71GJ369MRZA31WW4CP';
  
  console.log('测试 API Key:', apiKey);
  console.log('后端 URL:', backendUrl);
  
  try {
    // 测试健康检查
    console.log('\n1. 测试健康检查:');
    const healthRes = await fetch(`${backendUrl}/health`);
    console.log('健康检查:', await healthRes.text());
    
    // 测试 regions 端点
    console.log('\n2. 测试 /store/regions:');
    const regionsRes = await fetch(`${backendUrl}/store/regions`, {
      headers: {
        'x-publishable-api-key': apiKey
      }
    });
    
    console.log('状态:', regionsRes.status);
    console.log('响应:', await regionsRes.text());
    
    // 测试 products 端点
    console.log('\n3. 测试 /store/products:');
    const productsRes = await fetch(`${backendUrl}/store/products`, {
      headers: {
        'x-publishable-api-key': apiKey
      }
    });
    
    console.log('状态:', productsRes.status);
    console.log('响应:', await productsRes.text());
    
    // 检查是否有 region 数据
    console.log('\n4. 检查数据库中的 region:');
    const { execSync } = require('child_process');
    const regionCount = execSync(
      `PGPASSWORD=postgres psql -h localhost -U postgres -d medusa-medushav2n -t -c "SELECT COUNT(*) FROM region;"`,
      { encoding: 'utf8' }
    ).trim();
    console.log('Region 数量:', regionCount);
    
    // 检查 region 详情
    const regionDetails = execSync(
      `PGPASSWORD=postgres psql -h localhost -U postgres -d medusa-medushav2n -c "SELECT id, name, currency_code FROM region LIMIT 5;"`,
      { encoding: 'utf8' }
    );
    console.log('Region 详情:\n', regionDetails);
    
  } catch (error) {
    console.error('错误:', error.message);
  }
}

testAPI();