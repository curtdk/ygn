import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { AlipaySdk, AlipayFormData } from 'alipay-sdk'

/**
 * 创建支付宝支付订单
 * POST /store/alipay/create
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { order_id, amount, subject, body } = req.body as {
      order_id: string
      amount: string | number
      subject: string
      body?: string
    }

    if (!order_id || !amount || !subject) {
      return res.status(400).json({
        error: "缺少必要参数：order_id, amount, subject"
      })
    }

    // 初始化支付宝SDK
    const alipaySdk = new AlipaySdk({
      appId: process.env.ALIPAY_APP_ID,
      privateKey: process.env.ALIPAY_PRIVATE_KEY,
      alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY,
      gateway: 'https://openapi.alipay.com/gateway.do',
      signType: 'RSA2',
    })

    // 生成支付宝订单号
    const outTradeNo = `${order_id}_${Date.now()}`

    // 生成支付URL
    const paymentUrl = await alipaySdk.pageExec(
      'alipay.trade.wap.pay',
      'GET',
      {
        returnUrl: process.env.ALIPAY_RETURN_URL,
        notifyUrl: process.env.ALIPAY_NOTIFY_URL,
        bizContent: {
          out_trade_no: outTradeNo,
          total_amount: String(amount),
          subject,
          body,
          product_code: 'QUICK_WAP_WAY',
        }
      }
    )

    console.log('支付宝支付订单创建成功:', {
      order_id,
      out_trade_no: outTradeNo,
      amount
    })

    res.json({
      success: true,
      payment_url: paymentUrl,
      out_trade_no: outTradeNo,
    })
  } catch (error: any) {
    console.error('创建支付宝支付失败:', error)
    res.status(500).json({
      error: "创建支付失败",
      message: error.message
    })
  }
}
