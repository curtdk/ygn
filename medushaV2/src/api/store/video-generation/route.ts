import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { USER_VIDEO_MODULE } from "../../../modules/user-video"
import { generateVideoWorkflow } from "../../../workflows/generate-video"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const userVideoService = req.scope.resolve(USER_VIDEO_MODULE)
    const body = req.body as {
      product_id: string
      materials_used: Record<string, any>
      title: string
    }

    const {
      product_id,
      materials_used,
      title
    } = body

    console.log('收到视频生成请求:', { product_id, title, materials_used })

    // 1. 获取产品价格
    const { Modules } = await import('@medusajs/framework/utils')
    const productService = req.scope.resolve(Modules.PRODUCT)
    const product = await productService.retrieveProduct(product_id, {
      relations: ['variants', 'variants.prices']
    })

    const price = product.variants?.[0]?.prices?.[0]?.amount || 0
    const priceInCredits = Math.floor(price / 100) // 转换为积分（1元=1积分）

    console.log(`产品价格：${price}分 = ${priceInCredits}积分`)

    // 2. 验证用户余额
    const customerId = (req as any).auth?.actor_id || "guest"
    const customerService = req.scope.resolve(Modules.CUSTOMER)
    const customer = await customerService.retrieveCustomer(customerId)
    const balance = customer.metadata?.balance || 0

    console.log(`用户 ${customerId} 当前余额：${balance}积分`)

    if (balance < priceInCredits) {
      return res.status(400).json({
        code: "insufficient_balance",
        message: "余额不足，请先充值",
        required: priceInCredits,
        current: balance
      })
    }

    // 3. 创建订单
    const orderService = req.scope.resolve(Modules.ORDER)
    const order = await orderService.createOrders({
      currency_code: "cny",
      customer_id: customerId,
      metadata: {
        type: "video_generation",
        product_id,
        materials_used,
        price: priceInCredits,
        payment_status: "paid"
      }
    })

    console.log(`订单已创建：${order.id}`)

    // 4. 扣除余额
    await customerService.updateCustomers({
      id: customerId,
      metadata: {
        ...customer.metadata,
        balance: balance - priceInCredits
      }
    })

    console.log(`扣费成功：用户 ${customerId} 消费 ${priceInCredits} 积分，剩余余额：${balance - priceInCredits}`)

    // 5. 创建视频生成记录
    // @ts-expect-error - TypeScript suggests createUserVideoes but runtime uses createUserVideos
    const userVideo = await userVideoService.createUserVideos({
      user_id: customerId,
      order_id: order.id,  // 关联订单
      product_id,
      title,
      materials_used,
      status: "pending",
    })

    console.log('用户视频记录已创建:', userVideo.id)

    // 6. 异步触发视频生成工作流
    generateVideoWorkflow(req.scope)
      .run({
        input: {
          user_video_id: userVideo.id
        }
      })
      .then(() => {
        console.log('视频生成工作流完成:', userVideo.id)
      })
      .catch((error) => {
        console.error('视频生成工作流失败:', error)
        console.error('错误堆栈:', error.stack)
      })

    res.json({
      video: userVideo,
      message: "视频生成任务已创建，正在处理中..."
    })
  } catch (error: any) {
    console.error('视频生成API错误:', error)
    console.error('错误堆栈:', error.stack)

    res.status(500).json({
      code: "video_generation_error",
      type: "video_generation_error",
      message: error.message || "视频生成任务创建失败"
    })
  }
}
