import { AlipaySdk, AlipayFormData } from 'alipay-sdk'

export interface AlipayConfig {
  appId: string
  privateKey: string
  alipayPublicKey: string
  gateway?: string
  signType?: 'RSA2' | 'RSA'
}

export interface AlipayTradePagePayParams {
  outTradeNo: string
  totalAmount: string
  subject: string
  body?: string
  returnUrl?: string
  notifyUrl?: string
}

export class AlipayService {
  private alipaySdk: any

  constructor(config: AlipayConfig) {
    this.alipaySdk = new AlipaySdk({
      appId: config.appId,
      privateKey: config.privateKey,
      alipayPublicKey: config.alipayPublicKey,
      gateway: config.gateway || 'https://openapi.alipay.com/gateway.do',
      signType: config.signType || 'RSA2',
    })
  }

  /**
   * 创建手机网站支付（H5支付）
   */
  async createWapPay(params: AlipayTradePagePayParams): Promise<string> {
    const formData = new AlipayFormData()

    // 设置请求参数
    formData.setMethod('get')
    formData.addField('returnUrl', params.returnUrl || process.env.ALIPAY_RETURN_URL)
    formData.addField('notifyUrl', params.notifyUrl || process.env.ALIPAY_NOTIFY_URL)

    // 设置业务参数
    formData.addField('bizContent', {
      out_trade_no: params.outTradeNo,
      total_amount: params.totalAmount,
      subject: params.subject,
      body: params.body,
      product_code: 'QUICK_WAP_WAY', // 手机网站支付产品码
    })

    // 生成支付URL
    const result = await this.alipaySdk.exec(
      'alipay.trade.wap.pay',
      {},
      { formData }
    )

    return result as string
  }

  /**
   * 查询订单状态
   */
  async queryOrder(outTradeNo: string) {
    const result = await this.alipaySdk.exec('alipay.trade.query', {
      bizContent: {
        out_trade_no: outTradeNo,
      },
    })

    return result
  }

  /**
   * 关闭订单
   */
  async closeOrder(outTradeNo: string) {
    const result = await this.alipaySdk.exec('alipay.trade.close', {
      bizContent: {
        out_trade_no: outTradeNo,
      },
    })

    return result
  }

  /**
   * 退款
   */
  async refund(outTradeNo: string, refundAmount: string, refundReason?: string) {
    const result = await this.alipaySdk.exec('alipay.trade.refund', {
      bizContent: {
        out_trade_no: outTradeNo,
        refund_amount: refundAmount,
        refund_reason: refundReason,
      },
    })

    return result
  }

  /**
   * 验证支付宝回调签名
   */
  verifyNotify(postData: any): boolean {
    return this.alipaySdk.checkNotifySign(postData)
  }
}

// 创建单例实例
let alipayServiceInstance: AlipayService | null = null

export function getAlipayService(): AlipayService {
  if (!alipayServiceInstance) {
    const config: AlipayConfig = {
      appId: process.env.ALIPAY_APP_ID!,
      privateKey: process.env.ALIPAY_PRIVATE_KEY!,
      alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY!,
    }

    if (!config.appId || !config.privateKey || !config.alipayPublicKey) {
      throw new Error('支付宝配置不完整，请检查环境变量')
    }

    alipayServiceInstance = new AlipayService(config)
  }

  return alipayServiceInstance
}
