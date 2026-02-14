"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { productApi, videoApi, uploadApi } from "@lib/data/video-api"

interface Material {
  id: string
  name: string
  material_key: string
  material_type: string
  default_url: string
  is_replaceable: boolean
  sort_order: number
}

interface YgnConfigureTemplateProps {
  countryCode: string
}

export default function YgnConfigureTemplate({
  countryCode,
}: YgnConfigureTemplateProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("scene")

  const [product, setProduct] = useState<any>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, { url: string }>>({})
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (productId) {
      fetchProductData()
    }
  }, [productId])

  const fetchProductData = async () => {
    try {
      setLoading(true)

      // 获取产品详情
      const productResponse = await productApi.getProduct(productId!)
      setProduct(productResponse.product)

      // 获取可替换素材
      const materialsResponse = await productApi.getProductMaterials(productId!)
      setMaterials(materialsResponse.materials || [])

      // 初始化选中的素材为默认值
      const initialMaterials: Record<string, { url: string }> = {}
      materialsResponse.materials?.forEach((material: Material) => {
        initialMaterials[material.material_key] = {
          url: material.default_url
        }
      })
      setSelectedMaterials(initialMaterials)
    } catch (error) {
      console.error('Failed to fetch product data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (materialKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(materialKey)

      // 上传文件
      const uploadResponse = await uploadApi.uploadFile(file)

      // 更新选中的素材
      setSelectedMaterials(prev => ({
        ...prev,
        [materialKey]: {
          url: uploadResponse.url
        }
      }))
    } catch (error) {
      console.error('Failed to upload file:', error)
      alert('上传失败，请重试')
    } finally {
      setUploading(null)
    }
  }

  const handleGenerate = async () => {
    if (!product) return

    try {
      // 准备素材数据
      const materialsUsed: Record<string, any> = {}
      materials.forEach(material => {
        const selected = selectedMaterials[material.material_key]
        materialsUsed[material.material_key] = {
          original_url: material.default_url,
          replaced_url: selected?.url !== material.default_url ? selected?.url : null,
          type: material.material_type
        }
      })

      // 创建视频生成任务
      const response = await videoApi.createVideoGeneration({
        product_id: product.id,
        title: product.title,
        materials_used: materialsUsed
      })

      // 直接跳转到我的回忆页面等待视频生成完成
      router.push(`/${countryCode}/ygn/memories`)
    } catch (error) {
      console.error('Failed to create video generation:', error)
      alert('生成失败，请重试')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">产品不存在</p>
          <button
            onClick={() => router.push(`/${countryCode}/ygn/home`)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  const productImages = product.images?.map((img: any) => img.url) || [product.thumbnail]

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
          <button
            onClick={() => router.push(`/${countryCode}/ygn/home`)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">产品详情</h1>
        </div>

        {/* 产品轮播图 */}
        <div className="relative">
          <div className="aspect-video bg-gray-200 overflow-hidden">
            <img
              src={productImages[currentImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 轮播指示器 */}
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {productImages.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 w-2'
                  }`}
                />
              ))}
            </div>
          )}

          {/* 积分标签 */}
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full">
            <span className="text-sm font-medium">
              {product.variants?.[0]?.prices?.[0]?.amount
                ? Math.floor(product.variants[0].prices[0].amount / 100)
                : 10}积分
            </span>
          </div>
        </div>

        {/* 产品信息 */}
        <div className="px-4 py-4 bg-white border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h2>
          <p className="text-gray-600 text-sm">{product.description}</p>
        </div>

        {/* 可替换素材 */}
        <div className="px-4 py-4">
          <h3 className="font-semibold text-lg mb-4 text-gray-900">可替换素材</h3>
          <div className="grid grid-cols-2 gap-4">
            {materials.map((material) => (
              <div key={material.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{material.name}</h4>
                    <p className="text-xs text-gray-500">
                      {material.material_type === 'image' ? '图片' :
                       material.material_type === 'audio' ? '音频' :
                       material.material_type === 'video' ? '视频' : '背景'}
                    </p>
                  </div>
                  {selectedMaterials[material.material_key]?.url !== material.default_url && (
                    <div className="flex items-center text-green-600 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      已替换
                    </div>
                  )}
                </div>

                {/* 素材预览 */}
                {material.material_type === 'image' && (
                  <div className="mb-3">
                    <img
                      src={selectedMaterials[material.material_key]?.url || material.default_url}
                      alt={material.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* 替换按钮 */}
                {material.is_replaceable && (
                  <div>
                    <input
                      type="file"
                      id={`file-${material.material_key}`}
                      accept={material.material_type === 'image' ? 'image/*' :
                             material.material_type === 'audio' ? 'audio/*' :
                             material.material_type === 'video' ? 'video/*' : '*'}
                      onChange={(e) => handleFileSelect(material.material_key, e)}
                      className="hidden"
                    />
                    <label htmlFor={`file-${material.material_key}`}>
                      <button
                        type="button"
                        disabled={uploading === material.material_key}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        onClick={() => document.getElementById(`file-${material.material_key}`)?.click()}
                      >
                        {uploading === material.material_key ? (
                          <>
                            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            上传中...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            {selectedMaterials[material.material_key]?.url !== material.default_url
                              ? '重新选择'
                              : '选择文件'}
                          </>
                        )}
                      </button>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部生成按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            生成视频
          </button>
        </div>
      </div>
    </div>
  )
}
