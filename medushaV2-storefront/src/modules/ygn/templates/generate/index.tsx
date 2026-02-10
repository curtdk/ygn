"use client"

import { useRouter } from "next/navigation"

interface YgnGenerateTemplateProps {
  countryCode: string
}

export default function YgnGenerateTemplate({
  countryCode,
}: YgnGenerateTemplateProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center">
        {/* Animated Heart SVG */}
        <div className="mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="url(#heartGradient)"
            className="drop-shadow-lg"
            style={{
              animation: "heartPulse 1.5s ease-in-out infinite",
            }}
          >
            <defs>
              <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>

        {/* Title with orange gradient text */}
        <h1
          className="text-xl font-bold mb-2"
          style={{
            background: "linear-gradient(135deg, #f97316, #f59e0b)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          视频生成中
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm mb-2">AI正在为您制作专属回忆</p>

        {/* Loading dots */}
        <div className="flex gap-1.5 mt-4 mb-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-orange-400"
              style={{
                animation: "dotBounce 1.4s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Demo button */}
        <button
          onClick={() => router.push(`/${countryCode}/ygn/share`)}
          className="bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold py-3 px-8 rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl transition-all duration-200"
        >
          查看视频 (演示)
        </button>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes heartPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }
        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}