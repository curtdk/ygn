"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import SceneCard from "@modules/ygn/components/scene-card"
import BottomNavigation from "@modules/ygn/components/bottom-navigation"
import {
  MOCK_SCENES,
  MOCK_CATEGORIES,
  MOCK_USER_CREDITS,
} from "@lib/data/ygn"

interface YgnHomeTemplateProps {
  countryCode: string
}

export default function YgnHomeTemplate({
  countryCode,
}: YgnHomeTemplateProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredScenes =
    selectedCategory === "all"
      ? MOCK_SCENES
      : MOCK_SCENES.filter((s) => s.category === selectedCategory)

  const handleSceneSelect = (sceneId: string) => {
    router.push(`/${countryCode}/ygn/configure?scene=${sceneId}`)
  }

  const handlePersonManager = () => {
    router.push(`/${countryCode}/ygn/person-manager`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-5 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">忆光年</h1>
              <p className="text-orange-100 text-sm mt-1">
                选择场景，开启回忆之旅
              </p>
            </div>
            {/* Credits display */}
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-3 py-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#FBBF24" />
                <text x="12" y="16" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">$</text>
              </svg>
              <span className="text-white font-semibold text-sm">{MOCK_USER_CREDITS}</span>
            </div>
          </div>
        </div>

        {/* Person Manager Button */}
        <div className="px-4 -mt-3">
          <button
            onClick={handlePersonManager}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white
              font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg
              transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            <span>亲人照片设置</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {MOCK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-500 border border-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Banner */}
        <div className="px-4 mt-4">
          <div className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl px-4 py-3 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <div>
              <p className="text-white font-semibold text-sm">热门推荐场景</p>
              <p className="text-white/80 text-xs">精选最受欢迎的回忆场景</p>
            </div>
          </div>
        </div>

        {/* Scene Grid */}
        <div className="px-4 mt-4">
          {filteredScenes.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredScenes.map((scene) => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  onSelect={handleSceneSelect}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <p className="text-gray-400 mt-4 text-sm">该分类暂无场景</p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="mt-2 text-orange-500 text-sm font-medium hover:underline"
              >
                查看全部场景
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}