import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import AlipaySdk from 'alipay-sdk'

/**
 * 支付宝异步通知回调
 * POST /store/alipay/notify
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    // 初始化支付宝SDK
    const alipaySdk = new (AlipaySdk as any)({
      appId: process.env.ALIPAY_APP_ID,
      privateKey: process.env.ALIPAY_PRIVATE_KEY,
      alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY,
      gateway: 'https://openapi.alipay.com/gateway.do',
      signType: 'RSA2',
    })

    // 验证签名
    const isValid = alipaySdk.checkNotifySign(req.body)

    if (!isValid) {
      console.error('支付宝回调签名验证失败')
      return res.status(400).send('fail')
    }

    const {
      out_trade_no,
      trade_no,
      trade_status,
      total_amount,
      buyer_id,
      gmt_payment,
    } = req.body as any

    console.log('收到支付宝回调:', {
      out_trade_no,
      trade_no,
      trade_status,
      total_amount,
      buyer_id,
      gmt_payment,
    })

    // 处理支付成功
    if (trade_status === 'TRADE_SUCCESS' || trade_status === 'TRADE_FINISHED') {
      console.log('支付成功:', {
        out_trade_no,
        trade_no,
        amount: total_amount,
        payment_time: gmt_payment,
      })
    }

    // 返回success给支付宝，表示已处理
    res.send('success')
  } catch (error: any) {
    console.error('处理支付宝回调失败:', error)
    res.status(500).send('fail')
  }
}
