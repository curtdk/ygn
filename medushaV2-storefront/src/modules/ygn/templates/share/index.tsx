"use client"

import { useRouter } from "next/navigation"

interface YgnShareTemplateProps {
  countryCode: string
}

export default function YgnShareTemplate({
  countryCode,
}: YgnShareTemplateProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-5 pt-12 pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/${countryCode}/ygn/home`)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">分享视频</h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center px-6 pt-24 pb-12">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">分享回忆</h2>
          <p className="text-gray-500 text-center mb-8">
            页面开发中，敬请期待
          </p>

          <button
            onClick={() => router.push(`/${countryCode}/ygn/home`)}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-transform"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  )
}
