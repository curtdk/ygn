import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { AlipaySdk } from 'alipay-sdk'

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
    const alipaySdk = new AlipaySdk({
      appId: process.env.ALIPAY_APP_ID!,
      privateKey: process.env.ALIPAY_PRIVATE_KEY!,
      alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY!,
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

      // 解析订单号，判断是充值订单还是其他订单
      if (out_trade_no.startsWith('recharge_')) {
        // 充值订单处理
        const orderId = out_trade_no.split('_')[1]

        const { Modules } = await import('@medusajs/framework/utils')
        const orderService = req.scope.resolve(Modules.ORDER)
        const customerService = req.scope.resolve(Modules.CUSTOMER)

        // 获取订单信息
        const order = await orderService.retrieveOrder(orderId)
        const credits = order.metadata?.credits || 0
        const customerId = order.customer_id

        // 获取用户当前余额
        const customer = await customerService.retrieveCustomer(customerId)
        const currentBalance = customer.metadata?.balance || 0

        // 增加余额
        await customerService.updateCustomers({
          id: customerId,
          metadata: {
            ...customer.metadata,
            balance: currentBalance + credits
          }
        })

        // 更新订单状态
        await orderService.updateOrders({
          id: orderId,
          metadata: {
            ...order.metadata,
            payment_status: "paid",
            paid_at: new Date().toISOString(),
            alipay_trade_no: trade_no
          }
        })

        console.log(`充值成功：用户 ${customerId} 充值 ${credits} 积分，当前余额：${currentBalance + credits}`)
      }
    }

    // 返回success给支付宝，表示已处理
    res.send('success')
  } catch (error: any) {
    console.error('处理支付宝回调失败:', error)
    res.status(500).send('fail')
  }
}
