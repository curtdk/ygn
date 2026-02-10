"use client"

import { useRouter, useParams } from "next/navigation"

export default function YgnWelcomeTemplate() {
  const router = useRouter()
  const { countryCode } = useParams()

  return (
    <div className="relative min-h-[80vh] flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50" />
      <div
        className="absolute inset-0 opacity-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop')",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 py-16">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative mb-6 inline-block">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl shadow-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="white"
                stroke="white"
                strokeWidth="0"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent mb-3">
            忆光年
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            重温光阴，慰藉心灵
          </p>
        </div>

        {/* Description */}
        <div className="text-center max-w-sm mb-12">
          <p className="text-gray-700 leading-relaxed">
            上传珍贵照片，选择温馨场景
            <br />
            AI为您生成专属回忆视频
            <br />
            让美好时光重新绽放
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <button
            className="w-full h-14 text-lg font-medium rounded-xl shadow-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-all"
            onClick={() => router.push(`/${countryCode}/ygn/home`)}
          >
            立即体验
          </button>

          <button
            className="w-full h-12 text-base font-medium rounded-xl border-2 border-orange-300 text-orange-600 hover:bg-orange-50 transition-all"
            onClick={() => router.push(`/${countryCode}/account`)}
          >
            登录 / 注册账户
          </button>
        </div>

        {/* Store link */}
        <button
          className="mt-8 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => router.push(`/${countryCode}/store`)}
        >
          浏览商城 &rarr;
        </button>
      </div>
    </div>
  )
}
