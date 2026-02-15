import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

/**
 * 查询充值记录
 * GET /store/recharge/history
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
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
      // 未登录用户返回空列表
      return res.json({ records: [] })
    }

    const orderService = req.scope.resolve(Modules.ORDER)

    // 查询充值订单
    const orders = await orderService.listOrders({
      filters: {
        customer_id: customerId,
        "metadata.type": "recharge"
      },
      order: { created_at: "DESC" }
    })

    const records = orders.map((order: any) => ({
      id: order.id,
      date: order.created_at,
      package_id: order.metadata?.package_id,
      credits: order.metadata?.credits,
      amount: order.metadata?.credits, // 假设1积分=1元
      payment_status: order.metadata?.payment_status,
      method: "支付宝"
    }))

    console.log(`查询充值记录：用户 ${customerId}，共 ${records.length} 条记录`)

    res.json({ records })
  } catch (error: any) {
    console.error('查询充值记录失败:', error)
    res.status(500).json({ error: "查询失败", message: error.message })
  }
}
