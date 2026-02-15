import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import AlipaySdk from 'alipay-sdk'

/**
 * 查询支付宝订单状态
 * GET /store/alipay/query?out_trade_no=xxx
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { out_trade_no } = req.query as { out_trade_no?: string }

    if (!out_trade_no) {
      return res.status(400).json({
        error: "缺少参数：out_trade_no"
      })
    }

    // 初始化支付宝SDK
    const alipaySdk = new (AlipaySdk as any)({
      appId: process.env.ALIPAY_APP_ID,
      privateKey: process.env.ALIPAY_PRIVATE_KEY,
      alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY,
      gateway: 'https://openapi.alipay.com/gateway.do',
      signType: 'RSA2',
    })

    const result = await alipaySdk.exec('alipay.trade.query', {
      bizContent: {
        out_trade_no,
      },
    })

    res.json({
      success: true,
      data: result
    })
  } catch (error: any) {
    console.error('查询支付宝订单失败:', error)
    res.status(500).json({
      error: "查询订单失败",
      message: error.message
    })
  }
}
