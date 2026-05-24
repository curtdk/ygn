import { Metadata } from "next"
import OrderModeSettings from "@modules/account/components/order-mode-settings"

export const metadata: Metadata = {
  title: "接单模式设置",
  description: "设置服务订单的分配方式",
}

export default async function OrderModePage() {
  return <OrderModeSettings />
}