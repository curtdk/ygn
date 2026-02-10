"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MOCK_VIDEO_MEMORIES } from "@lib/data/ygn"
import type { VideoMemory } from "@/types/ygn"
import BottomNavigation from "@modules/ygn/components/bottom-navigation"

interface YgnMemoriesTemplateProps {
  countryCode: string
}

export default function YgnMemoriesTemplate({
  countryCode,
}: YgnMemoriesTemplateProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVideo, setSelectedVideo] = useState<VideoMemory | null>(null)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)
  const [showShareSheet, setShowShareSheet] = useState(false)
  const [shareVideoData, setShareVideoData] = useState<VideoMemory | null>(null)

  const filteredVideos = MOCK_VIDEO_MEMORIES.filter((video) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      video.title.toLowerCase().includes(q) ||
      video.sceneType.toLowerCase().includes(q) ||
      video.participants.some((p) => p.toLowerCase().includes(q))
    )
  })

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("zh-CN", {
      month: "long",
      day: "numeric",
      weekday: "short",
    })
  }

  const handlePlay = (video: VideoMemory) => {
    setSelectedVideo(video)
    setShowVideoPlayer(true)
  }

  const handleShare = (video: VideoMemory) => {
    setShareVideoData(video)
    setShowShareSheet(true)
  }

  const handleDownload = (video: VideoMemory) => {
    console.log("Downloading video:", video.id)
    alert(`正在下载: ${video.title}`)
  }

  const handleDelete = (video: VideoMemory) => {
    if (confirm(`确定要删除「${video.title}」吗？此操作不可撤销。`)) {
      console.log("Deleting video:", video.id)
      alert(`已删除: ${video.title}`)
    }
  }

  const handleShareAction = (action: string) => {
    console.log("Share action:", action, shareVideoData?.id)
    switch (action) {
      case "wechat":
        alert("微信分享功能开发中...")
        break
      case "copy":
        alert("链接已复制到剪贴板")
        break
      case "save":
        alert("已保存到相册")
        break
    }
    setShowShareSheet(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-5 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">我的回忆</h1>
              <p className="text-orange-100 text-sm mt-1">
                {MOCK_VIDEO_MEMORIES.length} 个回忆视频
              </p>
            </div>
            <button
              onClick={() => router.push(`/${countryCode}/ygn/home`)}
              className="flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-4 py-2 text-white text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              创建
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 -mt-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="搜索回忆..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            />
          </div>
        </div>

        {/* Video List */}
        <div className="px-4 mt-4 space-y-4">
          {filteredVideos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="m10 8 6 4-6 4V8z" />
              </svg>
              <p className="mt-3 text-sm font-medium">
                {searchQuery ? "没有找到匹配的回忆" : "还没有回忆视频"}
              </p>
              <p className="text-xs mt-1">
                {searchQuery ? "试试其他关键词" : "去创建你的第一个回忆吧"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => router.push(`/${countryCode}/ygn/home`)}
                  className="mt-4 px-5 py-2 bg-orange-500 text-white text-sm rounded-full hover:bg-orange-600 transition-colors"
                >
                  开始创建
                </button>
              )}
            </div>
          ) : (
            filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
              >
                {/* Thumbnail */}
                <div
                  className="relative aspect-video bg-gray-200 cursor-pointer"
                  onClick={() => handlePlay(video)}
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#f97316" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="6 3 20 12 6 21 6 3" />
                      </svg>
                    </div>
                  </div>
                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {formatDuration(video.duration)}
                  </div>
                  {/* Scene type badge */}
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                    {video.sceneType}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{video.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(video.createdDate)}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {video.participants.map((p, i) => (
                      <span
                        key={i}
                        className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full"
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handlePlay(video)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                        <polygon points="6 3 20 12 6 21 6 3" />
                      </svg>
                      播放
                    </button>
                    <button
                      onClick={() => handleShare(video)}
                      className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                      title="分享"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3" />
                        <circle cx="6" cy="12" r="3" />
                        <circle cx="18" cy="19" r="3" />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDownload(video)}
                      className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                      title="下载"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(video)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Video Player Modal */}
      {showVideoPlayer && selectedVideo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl overflow-hidden">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="m10 8 6 4-6 4V8z" />
                </svg>
                <p className="text-sm">视频播放功能开发中...</p>
                <p className="text-xs text-gray-400 mt-1">{selectedVideo.title}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowVideoPlayer(false)
                setSelectedVideo(null)
              }}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Share Sheet */}
      {showShareSheet && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowShareSheet(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 animate-slide-up">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-4">分享到</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleShareAction("wechat")}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  W
                </div>
                <span className="text-sm font-medium text-gray-700">微信分享</span>
              </button>
              <button
                onClick={() => handleShareAction("copy")}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">复制链接</span>
              </button>
              <button
                onClick={() => handleShareAction("save")}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">保存到相册</span>
              </button>
            </div>
            <button
              onClick={() => setShowShareSheet(false)}
              className="w-full mt-4 py-3 text-sm text-gray-500 font-medium hover:text-gray-700 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}