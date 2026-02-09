const { Medusa } = require("@medusajs/medusa");

async function testPublishableKeys() {
  try {
    const medusa = new Medusa({ baseUrl: "http://localhost:9000" });
    
    // 尝试使用前端配置的发布密钥
    const response = await medusa.store.regions.list({
      'x-publishable-api-key': 'apk_01KGFMBC71GJ369MRZA31WW4CP'
    });
    
    console.log("Response:", response);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testPublishableKeys();