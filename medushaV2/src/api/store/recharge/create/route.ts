import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { AlipaySdk } from 'alipay-sdk'

/**
 * 创建充值订单
 * POST /store/recharge/create
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { package_id, amount, credits } = req.body as {
      package_id: string
      amount: number
      credits: number
    }

    if (!package_id || !amount || !credits) {
      return res.status(400).json({
        error: "缺少必要参数：package_id, amount, credits"
      })
    }

    // 获取用户ID - 从JWT token中提取
    let customerId = (req as any).auth?.actor_id || (req as any).auth?.customer_id

    // 如果 req.auth 未定义，尝试从 cookie 中的 JWT 解析
    if (!customerId) {
      const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
      }, {} as Record<string, string>)

      const jwt = cookies?._medusa_jwt

      if (jwt) {
        try {
          // 解码 JWT (base64)
          const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString())
          customerId = payload.actor_id || payload.app_metadata?.customer_id
          console.log('从JWT中提取用户ID:', customerId)
        } catch (error) {
          console.error('JWT解析失败:', error)
        }
      }
    }

    if (!customerId) {
      return res.status(401).json({
        error: "未登录",
        message: "请先登录后再进行充值"
      })
    }

    console.log(`用户 ${customerId} 请求充值，套餐：${package_id}，金额：${amount}，积分：${credits}`)

    // 1. 创建充值订单
    const orderService = req.scope.resolve(Modules.ORDER)
    const order = await orderService.createOrders({
      currency_code: "cny",
      customer_id: customerId,
      metadata: {
        type: "recharge",
        package_id,
        credits,
        payment_status: "pending"
      }
    })

    console.log(`创建充值订单：订单ID ${order.id}，用户 ${customerId}，金额 ${amount}，积分 ${credits}`)

    // 2. 调用支付宝支付
    const alipaySdk = new AlipaySdk({
      appId: process.env.ALIPAY_APP_ID!,
      privateKey: process.env.ALIPAY_PRIVATE_KEY!,
      alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY!,
      gateway: 'https://openapi.alipay.com/gateway.do',
      signType: 'RSA2',
    })

    const outTradeNo = `recharge_${order.id}_${Date.now()}`

    const paymentUrl = await alipaySdk.pageExec(
      'alipay.trade.wap.pay',
      'GET',
      {
        returnUrl: `${process.env.FRONTEND_URL}/dk/ygn/recharge/success`,
        notifyUrl: process.env.ALIPAY_NOTIFY_URL,
        bizContent: {
          out_trade_no: outTradeNo,
          total_amount: String(amount),
          subject: `积分充值-${credits}积分`,
          body: `充值套餐：${package_id}`,
          product_code: 'QUICK_WAP_WAY',
        }
      }
    )

    // 3. 更新订单，保存支付宝订单号
    await orderService.updateOrders([{
      id: order.id,
      metadata: {
        ...order.metadata,
        alipay_trade_no: outTradeNo
      }
    }])

    console.log(`支付宝订单创建成功：${outTradeNo}`)

    res.json({
      success: true,
      order_id: order.id,
      payment_url: paymentUrl,
      out_trade_no: outTradeNo
    })
  } catch (error: any) {
    console.error('创建充值订单失败:', error)
    res.status(500).json({ error: "创建失败", message: error.message })
  }
}
