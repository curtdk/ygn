import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

/**
 * 查询用户余额
 * GET /store/user/balance
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
      // 未登录用户返回 0 余额
      return res.json({
        balance: 0,
        customer_id: null,
        message: "未登录"
      })
    }

    const customerService = req.scope.resolve(Modules.CUSTOMER)

    try {
      const customer = await customerService.retrieveCustomer(customerId)
      const balance = customer.metadata?.balance || 0

      console.log(`查询用户余额：用户 ${customerId}，余额 ${balance}`)

      res.json({
        balance,
        customer_id: customerId
      })
    } catch (error) {
      // 如果客户不存在，返回 0 余额
      console.log(`客户 ${customerId} 不存在，返回 0 余额`)
      res.json({
        balance: 0,
        customer_id: customerId
      })
    }
  } catch (error: any) {
    console.error('查询用户余额失败:', error)
    res.status(500).json({ error: "查询失败", message: error.message })
  }
}
