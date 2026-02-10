"use client"

import type { Person } from "@/types/ygn"
import { RELATIONSHIP_LABELS } from "@/types/ygn"

interface PersonCardProps {
  person: Person
  onEdit: (personId: string) => void
}

const AVATAR_GRADIENTS = [
  "from-orange-400 to-amber-300",
  "from-rose-400 to-pink-300",
  "from-blue-400 to-cyan-300",
  "from-emerald-400 to-teal-300",
  "from-violet-400 to-purple-300",
  "from-amber-400 to-yellow-300",
]

function getGradient(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length]
}

export default function PersonCard({ person, onEdit }: PersonCardProps) {
  const relationshipLabel = RELATIONSHIP_LABELS[person.relationship]
  const avatarChar = relationshipLabel.charAt(0)
  const gradient = getGradient(person.id)
  const defaultPhoto = person.photos.find((p) => p.isDefault)

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white
      shadow-sm border border-gray-100 hover:border-orange-200
      hover:shadow-md transition-all duration-200"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {defaultPhoto ? (
          <img
            src={defaultPhoto.url}
            alt={person.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-100"
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient}
              flex items-center justify-center text-white font-bold text-lg
              ring-2 ring-orange-100`}
          >
            {avatarChar}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-gray-900 truncate">
          {person.name}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full
            text-xs font-medium bg-orange-50 text-orange-600">
            {relationshipLabel}
          </span>
          {person.age && (
            <span className="text-xs text-gray-400">{person.age}岁</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span>{person.photos.length} 张照片</span>
          <span>{person.voices.length} 段语音</span>
        </div>
      </div>

      {/* Edit button */}
      <button
        onClick={() => onEdit(person.id)}
        className="flex-shrink-0 p-2 rounded-lg text-gray-400
          hover:text-orange-500 hover:bg-orange-50 transition-colors"
        title="编辑"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="m15 5 4 4" />
        </svg>
      </button>
    </div>
  )
}