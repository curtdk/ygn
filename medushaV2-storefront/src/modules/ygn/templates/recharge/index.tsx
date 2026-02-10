"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MOCK_CREDIT_PACKAGES, MOCK_PURCHASE_RECORDS } from "@lib/data/ygn"

interface YgnRechargeTemplateProps {
  countryCode: string
}

export default function YgnRechargeTemplate({
  countryCode,
}: YgnRechargeTemplateProps) {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"wechat" | "alipay">("wechat")
  const [currentCredits] = useState(25)

  const selectedPkg = MOCK_CREDIT_PACKAGES.find((p) => p.id === selectedPackage)

  const handlePurchase = () => {
    if (!selectedPkg) return
    setTimeout(() => {
      alert(`充值成功！已购买${selectedPkg.name}，获得${selectedPkg.credits + selectedPkg.bonusCredits}积分`)
      router.push(`/${countryCode}/ygn/home`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-5 pt-12 pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">积分充值</h1>
          </div>
        </div>

        {/* Current Credits Card */}
        <div className="px-4 -mt-3">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#FFF" strokeWidth="2" />
                  <text x="12" y="16" textAnchor="middle" fill="#FFF" fontSize="12" fontWeight="bold">$</text>
                </svg>
              </div>
              <div>
                <p className="text-amber-100 text-sm">当前余额</p>
                <p className="text-white text-3xl font-bold">{currentCredits}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Packages */}
        <div className="px-4 mt-5">
          <h2 className="text-base font-semibold text-gray-800 mb-3">选择套餐</h2>
          <div className="space-y-3">
            {MOCK_CREDIT_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`w-full text-left rounded-xl p-4 border-2 transition-all ${
                  selectedPackage === pkg.id
                    ? "border-orange-500 bg-orange-50 shadow-md"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{pkg.name}</span>
                      {pkg.isPopular && (
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">热门</span>
                      )}
                      {pkg.bonusCredits > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">+{pkg.bonusCredits}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{pkg.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {pkg.credits}积分{pkg.bonusCredits > 0 ? ` + ${pkg.bonusCredits}赠送` : ""}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-lg font-bold text-orange-600">¥{pkg.price}</p>
                    {pkg.originalPrice && (
                      <p className="text-xs text-gray-400 line-through">¥{pkg.originalPrice}</p>
                    )}
                  </div>
                  <div className={`ml-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPackage === pkg.id ? "border-orange-500" : "border-gray-300"
                  }`}>
                    {selectedPackage === pkg.id && (
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        {selectedPackage && (
          <div className="px-4 mt-5">
            <h2 className="text-base font-semibold text-gray-800 mb-3">支付方式</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setPaymentMethod("wechat")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                  paymentMethod === "wechat"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#07C160">
                  <circle cx="12" cy="12" r="10" />
                  <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">W</text>
                </svg>
                <span className={`text-sm font-medium ${paymentMethod === "wechat" ? "text-green-700" : "text-gray-600"}`}>微信支付</span>
              </button>
              <button
                onClick={() => setPaymentMethod("alipay")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                  paymentMethod === "alipay"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1677FF">
                  <circle cx="12" cy="12" r="10" />
                  <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">A</text>
                </svg>
                <span className={`text-sm font-medium ${paymentMethod === "alipay" ? "text-blue-700" : "text-gray-600"}`}>支付宝</span>
              </button>
            </div>
          </div>
        )}

        {/* Purchase Button */}
        {selectedPkg && (
          <div className="px-4 mt-5">
            <button
              onClick={handlePurchase}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-transform"
            >
              立即充值 ¥{selectedPkg.price}
            </button>
          </div>
        )}

        {/* Purchase History */}
        <div className="px-4 mt-6">
          <h2 className="text-base font-semibold text-gray-800 mb-3">充值记录</h2>
          {MOCK_PURCHASE_RECORDS.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">暂无充值记录</p>
          ) : (
            <div className="space-y-2">
              {MOCK_PURCHASE_RECORDS.map((record) => (
                <div key={record.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{record.packageName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{record.date} | {record.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-600">+{record.credits}积分</p>
                      <p className="text-xs text-gray-400">¥{record.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}