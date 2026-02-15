/**
 * 支付宝支付测试脚本
 *
 * 使用方法：
 * 1. 确保已配置 .env 文件中的支付宝参数
 * 2. 运行: node test-alipay.js
 */

const axios = require('axios')

const BACKEND_URL = 'http://localhost:9000'

async function testCreatePayment() {
  console.log('=== 测试创建支付宝支付订单 ===\n')

  try {
    const response = await axios.post(`${BACKEND_URL}/store/alipay/create`, {
      order_id: `TEST_${Date.now()}`,
      amount: '0.01', // 测试金额：0.01元
      subject: '测试订单 - 视频生成服务',
      body: '这是一个测试订单，用于验证支付宝H5支付集成'
    })

    console.log('✅ 支付订单创建成功!')
    console.log('订单号:', response.data.out_trade_no)
    console.log('支付URL:', response.data.payment_url)
    console.log('\n请在手机浏览器中打开以下URL进行支付测试:')
    console.log(response.data.payment_url)
    console.log('\n或者扫描生成的二维码进行支付')

    return response.data
  } catch (error) {
    console.error('❌ 创建支付订单失败:', error.response?.data || error.message)
    throw error
  }
}

async function testQueryPayment(outTradeNo) {
  console.log('\n=== 测试查询支付订单状态 ===\n')

  try {
    const response = await axios.get(`${BACKEND_URL}/store/alipay/query`, {
      params: { out_trade_no: outTradeNo }
    })

    console.log('✅ 查询成功!')
    console.log('订单状态:', JSON.stringify(response.data, null, 2))

    return response.data
  } catch (error) {
    console.error('❌ 查询订单失败:', error.response?.data || error.message)
    throw error
  }
}

async function runTests() {
  console.log('开始支付宝支付集成测试...\n')

  try {
    // 测试1: 创建支付订单
    const paymentData = await testCreatePayment()

    // 等待用户支付
    console.log('\n请完成支付后，按回车键继续查询订单状态...')
    await new Promise(resolve => {
      process.stdin.once('data', resolve)
    })

    // 测试2: 查询订单状态
    await testQueryPayment(paymentData.out_trade_no)

    console.log('\n✅ 所有测试完成!')
  } catch (error) {
    console.error('\n❌ 测试失败')
    process.exit(1)
  }
}

// 运行测试
runTests()
