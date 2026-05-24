"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SceneCard from "@modules/ygn/components/scene-card"
import BottomNavigation from "@modules/ygn/components/bottom-navigation"
import { productApi } from "@lib/data/video-api"
import {
  MOCK_SCENES,
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
  const [scenes, setScenes] = useState<any[]>([])
  const [categories, setCategories] = useState<Array<{ id: string; label: string }>>([
    { id: "all", label: "全部" }
  ])
  const [loading, setLoading] = useState(true)

  // 从API获取分类和产品数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // 获取分类
        const collectionsResponse = await productApi.getCollections()
        const apiCategories = [
          { id: "all", label: "全部" },
          ...(collectionsResponse.collections || []).map((col: any) => ({
            id: col.id,
            label: col.title
          }))
        ]
        setCategories(apiCategories)

        // 获取产品（根据选择的分类）
        const collectionId = selectedCategory === "all" ? undefined : selectedCategory
        const response = await productApi.getProducts(collectionId)

        // 过滤出有video_material的产品
        const videoProducts = []
        for (const product of response.products || []) {
          try {
            // 检查产品是否有素材
            const materialsResponse = await productApi.getProductMaterials(product.id)
            if (materialsResponse.materials && materialsResponse.materials.length > 0) {
              // 转换为Scene格式
              videoProducts.push({
                id: product.id,
                handle: product.handle, // 添加handle用于跳转
                variantId: product.variants?.[0]?.id, // 添加variantId
                name: product.title,
                description: product.description || '生成专属回忆视频',
                previewImage: product.thumbnail || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop',
                creditsRequired: product.variants?.[0]?.prices?.[0]?.amount
                  ? Math.floor(product.variants[0].prices[0].amount / 100)
                  : 10,
                category: product.collection_id || 'all',
                isPopular: product.metadata?.is_popular === 'true'
              })
            }
          } catch (error) {
            console.log(`Product ${product.id} has no materials, skipping`)
          }
        }

        // 如果没有产品，使用默认数据
        setScenes(videoProducts.length > 0 ? videoProducts : MOCK_SCENES)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        // 使用默认数据作为后备
        setScenes(MOCK_SCENES)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory])

  const handleSceneSelect = (sceneId: string) => {
    // 找到对应的scene
    const scene = scenes.find(s => s.id === sceneId)
    if (scene && scene.handle) {
      // 跳转到服务产品页面
      const variantParam = scene.variantId ? `?v_id=${scene.variantId}` : ''
      router.push(`/${countryCode}/service/product/${scene.handle}${variantParam}`)
    } else {
      // 后备：使用原来的configure页面
      router.push(`/${countryCode}/ygn/configure?scene=${sceneId}`)
    }
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
            {categories.map((cat) => (
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
          {loading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-4 text-sm">加载中...</p>
            </div>
          ) : scenes.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {scenes.map((scene) => (
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