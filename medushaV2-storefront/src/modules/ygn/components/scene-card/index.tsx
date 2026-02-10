"use client"

import type { Scene } from "@/types/ygn"
import { SCENE_CATEGORIES } from "@/types/ygn"

interface SceneCardProps {
  scene: Scene
  onSelect: (sceneId: string) => void
}

export default function SceneCard({ scene, onSelect }: SceneCardProps) {
  return (
    <div
      onClick={() => onSelect(scene.id)}
      className="group cursor-pointer rounded-xl shadow-sm border border-gray-100
        overflow-hidden bg-white hover:shadow-md hover:border-orange-200
        transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Image container - 3:2 aspect ratio */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={scene.previewImage}
          alt={scene.name}
          className="w-full h-full object-cover group-hover:scale-105
            transition-transform duration-300"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Popular badge - top left */}
        {scene.isPopular && (
          <div className="absolute top-2 left-2 flex items-center gap-1
            bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>热门</span>
          </div>
        )}

        {/* Credits badge - top right */}
        <div className="absolute top-2 right-2 flex items-center gap-1
          bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <circle cx="12" cy="12" r="10" fill="#F59E0B" />
            <text x="12" y="16" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">$</text>
          </svg>
          <span>{scene.creditsRequired}</span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 truncate">
              {scene.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
              {scene.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full
            text-xs font-medium bg-orange-50 text-orange-600">
            {SCENE_CATEGORIES[scene.category]}
          </span>
          <span className="text-xs text-gray-400">
            {scene.creditsRequired} 积分
          </span>
        </div>
      </div>
    </div>
  )
}
