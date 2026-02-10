"use client"

import type { VideoMemory } from "@/types/ygn"

interface MemoryCardProps {
  video: VideoMemory
  onPlay: (video: VideoMemory) => void
  onShare: (video: VideoMemory) => void
  onDownload: (video: VideoMemory) => void
  onDelete: (video: VideoMemory) => void
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export default function MemoryCard({
  video,
  onPlay,
  onShare,
  onDownload,
  onDelete,
}: MemoryCardProps) {
  return (
    <div className="rounded-xl shadow-sm border border-gray-100 overflow-hidden bg-white">
      {/* Thumbnail with play overlay */}
      <div
        className="relative aspect-video cursor-pointer group"
        onClick={() => onPlay(video)}
      >
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center
          bg-black/20 group-hover:bg-black/30 transition-colors">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center
            justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#F97316"
              stroke="none"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>

        {/* Duration badge - bottom right */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white
          text-xs font-medium px-2 py-0.5 rounded">
          {formatDuration(video.duration)}
        </div>

        {/* Scene type badge - top left */}
        <div className="absolute top-2 left-2 bg-orange-500 text-white
          text-xs font-medium px-2 py-1 rounded-full">
          {video.sceneType}
        </div>
      </div>

      {/* Card content */}
      <div className="p-3 space-y-2">
        <div>
          <h3 className="font-semibold text-sm text-gray-900 truncate">
            {video.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{video.createdDate}</p>
        </div>

        {/* Participants */}
        {video.participants.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-xs text-gray-500">参与者:</span>
            {video.participants.map((name, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-1.5 py-0.5
                  rounded text-xs bg-gray-100 text-gray-600"
              >
                {name}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
          <button
            onClick={() => onPlay(video)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5
              rounded-lg bg-orange-50 text-orange-600 text-xs font-medium
              hover:bg-orange-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            播放
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onShare(video) }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500
              hover:bg-orange-50 transition-colors"
            title="分享"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onDownload(video) }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500
              hover:bg-orange-50 transition-colors"
            title="下载"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(video) }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500
              hover:bg-red-50 transition-colors"
            title="删除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}