const { Medusa } = require("@medusajs/medusa");

async function createPublishableKey() {
  try {
    // 初始化 Medusa
    const medusa = new Medusa({
      baseUrl: "http://localhost:9000",
      maxRetries: 3,
    });
    
    // 使用管理员凭据登录
    const authResponse = await medusa.admin.auth.createSession({
      email: "admin@medusa.com",
      password: "admin123",
    });
    
    console.log("登录成功");
    
    // 创建 Publishable API Key
    const keyResponse = await medusa.admin.publishableApiKeys.create({
      title: "Storefront Key",
    });
    
    console.log("Publishable API Key 创建成功:");
    console.log("Key:", keyResponse.publishable_api_key.id);
    console.log("Secret:", keyResponse.publishable_api_key.secret || "N/A");
    
    return keyResponse.publishable_api_key.id;
  } catch (error) {
    console.error("错误:", error.message);
    // 尝试直接使用 API
    console.log("尝试直接调用 API...");
    
    // 使用 curl 直接调用 API
    const { execSync } = require('child_process');
    
    // 首先获取访问令牌
    const authResult = execSync(
      `curl -s -X POST http://localhost:9000/admin/auth/token \
        -H "Content-Type: application/json" \
        -d '{"email": "admin@medusa.com", "password": "admin123"}'`,
      { encoding: 'utf8' }
    );
    
    console.log("认证响应:", authResult);
    
    // 尝试解析响应
    try {
      const authData = JSON.parse(authResult);
      if (authData.access_token) {
        // 创建 API Key
        const keyResult = execSync(
          `curl -s -X POST http://localhost:9000/admin/publishable-api-keys \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${authData.access_token}" \
            -d '{"title": "Storefront Key"}'`,
          { encoding: 'utf8' }
        );
        
        console.log("API Key 创建响应:", keyResult);
        const keyData = JSON.parse(keyResult);
        console.log("Publishable API Key:", keyData.publishable_api_key?.id || "未找到");
        return keyData.publishable_api_key?.id;
      }
    } catch (parseError) {
      console.error("解析错误:", parseError.message);
    }
  }
}

// 运行脚本
createPublishableKey().then(key => {
  if (key) {
    console.log("\n✅ 请将以下 Key 添加到前端环境变量:");
    console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${key}`);
  } else {
    console.log("\n❌ 未能创建 API Key");
    console.log("请手动在管理面板中创建:");
    console.log("1. 访问 http://localhost:9000/app");
    console.log("2. 使用 admin@medusa.com / admin123 登录");
    console.log("3. 进入 Settings -> Publishable API Keys");
    console.log("4. 创建新的 Key 并复制");
  }
});