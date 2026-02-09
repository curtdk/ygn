// 创建默认 region 的脚本
const { execSync } = require('child_process');

async function createRegion() {
  console.log('正在创建默认 region...');
  
  try {
    // 首先检查是否已有 region
    const checkResult = execSync(
      `PGPASSWORD=postgres psql -h localhost -U postgres -d medusa-medushav2n -t -c "SELECT COUNT(*) FROM region;"`,
      { encoding: 'utf8' }
    ).trim();
    
    if (parseInt(checkResult) > 0) {
      console.log('已有 region 存在，跳过创建');
      return;
    }
    
    // 创建默认 region (美国)
    console.log('创建美国 region...');
    const regionId = 'reg_01' + Date.now().toString().slice(-10);
    
    const insertRegion = `
      INSERT INTO region (id, name, currency_code, automatic_taxes, created_at, updated_at)
      VALUES (
        '${regionId}',
        'United States',
        'usd',
        true,
        NOW(),
        NOW()
      );
    `;
    
    execSync(
      `PGPASSWORD=postgres psql -h localhost -U postgres -d medusa-medushav2n -c "${insertRegion}"`,
      { encoding: 'utf8' }
    );
    
    console.log('✅ 成功创建 region:', regionId);
    
    // 关联 region 到 sales channel
    console.log('关联 region 到 sales channel...');
    
    // 获取默认 sales channel
    const salesChannelResult = execSync(
      `PGPASSWORD=postgres psql -h localhost -U postgres -d medusa-medushav2n -t -c "SELECT id FROM sales_channel LIMIT 1;"`,
      { encoding: 'utf8' }
    ).trim();
    
    if (salesChannelResult) {
      const salesChannelId = salesChannelResult;
      const linkId = 'rsc_' + Date.now().toString().slice(-10);
      
      const insertLink = `
        INSERT INTO region_sales_channel (id, region_id, sales_channel_id, created_at, updated_at)
        VALUES (
          '${linkId}',
          '${regionId}',
          '${salesChannelId}',
          NOW(),
          NOW()
        );
      `;
      
      execSync(
        `PGPASSWORD=postgres psql -h localhost -U postgres -d medusa-medushav2n -c "${insertLink}"`,
        { encoding: 'utf8' }
      );
      
      console.log('✅ 成功关联 region 到 sales channel');
    }
    
    // 创建默认 currency
    console.log('创建默认 currency...');
    const currencyId = 'cur_' + Date.now().toString().slice(-10);
    
    const insertCurrency = `
      INSERT INTO currency (id, code, symbol, symbol_native, name, created_at, updated_at)
      VALUES (
        '${currencyId}',
        'usd',
        '$',
        '$',
        'US Dollar',
        NOW(),
        NOW()
      );
    `;
    
    execSync(
      `PGPASSWORD=postgres psql -h localhost -U postgres -d medusa-medushav2n -c "${insertCurrency}"`,
      { encoding: 'utf8' }
    );
    
    console.log('✅ 成功创建 currency: USD');
    
    // 更新 region 的 currency
    const updateRegion = `
      UPDATE region 
      SET currency_code = 'usd', updated_at = NOW()
      WHERE id = '${regionId}';
    `;
    
    execSync(
      `PGPASSWORD=postgres psql -h localhost -U postgres -d medusa-medushav2n -c "${updateRegion}"`,
      { encoding: 'utf8' }
    );
    
    console.log('✅ 更新 region currency 为 USD');
    
    console.log('\n🎉 Region 配置完成！');
    console.log('请重启 Medusa 服务器使更改生效。');
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error('详细错误:', error);
  }
}

createRegion();