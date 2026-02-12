"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  MOCK_SCENE_DATA,
  MOCK_ROLE_STRUCTURE,
  MOCK_PHOTOS_BY_SUBROLE,
} from "@lib/data/ygn"

interface YgnConfigureTemplateProps {
  countryCode: string
}

export default function YgnConfigureTemplate({
  countryCode,
}: YgnConfigureTemplateProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sceneId = searchParams.get("scene") || "1"

  const scene = MOCK_SCENE_DATA[sceneId]

  const [selectedRole, setSelectedRole] = useState<string>("myself")
  const [selectedSubRole, setSelectedSubRole] = useState<string>("")
  const [selectedPhoto, setSelectedPhoto] = useState<string>("")
  const [showSubRoles, setShowSubRoles] = useState<boolean>(false)

  const roleOptions = [
    { id: "myself", label: "自己", emoji: "\uD83D\uDC64" },
    { id: "friend", label: "朋友", emoji: "\uD83D\uDC6B" },
    { id: "family", label: "亲人", emoji: "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66" },
  ]

  // Auto-select first sub-role when role changes
  useEffect(() => {
    const roleData = MOCK_ROLE_STRUCTURE[selectedRole]
    if (roleData && roleData.subRoles.length > 0) {
      setSelectedSubRole(roleData.subRoles[0].id)
      setShowSubRoles(selectedRole !== "myself")
    } else {
      setSelectedSubRole("")
      setShowSubRoles(false)
    }
  }, [selectedRole])

  // Auto-select first photo when sub-role changes
  useEffect(() => {
    if (selectedSubRole) {
      const photos = MOCK_PHOTOS_BY_SUBROLE[selectedSubRole] || []
      setSelectedPhoto(photos.length > 0 ? photos[0].id : "")
    }
  }, [selectedSubRole])

  const currentSubRoles = MOCK_ROLE_STRUCTURE[selectedRole]?.subRoles || []
  const currentPhotos = selectedSubRole
    ? MOCK_PHOTOS_BY_SUBROLE[selectedSubRole] || []
    : []

  const handleGenerate = () => {
    router.push(
      `/${countryCode}/ygn/generate?scene=${sceneId}&role=${selectedRole}&subRole=${selectedSubRole}&photo=${selectedPhoto}`
    )
  }

  if (!scene) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">场景未找到</p>
      </div>
    )
  }

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
          <h1 className="text-lg font-semibold text-gray-900">配置角色</h1>
        </div>

        {/* Scene Preview */}
        <div className="px-4 mt-4">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={scene.previewImage}
              alt={scene.name}
              className="w-full h-48 object-cover"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#f97316">
                  <polygon points="8,5 20,12 8,19" />
                </svg>
              </div>
            </div>
            {/* Credits badge */}
            <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {scene.creditsRequired} 积分
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mt-3">{scene.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{scene.description}</p>
        </div>

        {/* Role Selection */}
        <div className="px-4 mt-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">选择角色</h3>
          <div className="grid grid-cols-3 gap-3">
            {roleOptions.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === role.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white hover:border-orange-200"
                }`}
              >
                <span className="text-2xl">{role.emoji}</span>
                <span
                  className={`text-sm font-medium ${
                    selectedRole === role.id ? "text-orange-600" : "text-gray-700"
                  }`}
                >
                  {role.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-role Selection */}
        {showSubRoles && currentSubRoles.length > 0 && (
          <div className="px-4 mt-4">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              选择具体角色
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentSubRoles.map((subRole) => (
                <button
                  key={subRole.id}
                  onClick={() => setSelectedSubRole(subRole.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedSubRole === subRole.id
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500"
                  }`}
                >
                  {subRole.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Photo Selection */}
        <div className="px-4 mt-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">选择照片</h3>
          {currentPhotos.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {currentPhotos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo.id)}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all duration-200 ${
                    selectedPhoto === photo.id
                      ? "border-orange-500 ring-2 ring-orange-200"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedPhoto === photo.id && (
                    <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-gray-400 text-sm mt-3">暂无照片</p>
              <button
                onClick={() => router.push(`/${countryCode}/ygn/person-manager`)}
                className="mt-2 text-orange-500 text-sm font-medium hover:underline"
              >
                前往添加照片
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleGenerate}
            disabled={!selectedPhoto}
            className={`w-full py-3.5 rounded-xl text-white font-semibold text-base transition-all duration-200 ${
              selectedPhoto
                ? "bg-gradient-to-r from-orange-500 to-orange-400 shadow-lg shadow-orange-200 hover:shadow-xl"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            生成视频
          </button>
        </div>
      </div>
    </div>
  )
}
