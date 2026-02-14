"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { videoApi } from "@lib/data/video-api"
import BottomNavigation from "@modules/ygn/components/bottom-navigation"

interface UserVideo {
  id: string
  title: string
  video_url: string | null
  thumbnail_url: string | null
  status: "pending" | "processing" | "completed" | "failed"
  duration: number
  created_at: string
  materials_used: Record<string, any>
  error_message: string | null
}

interface YgnMemoriesTemplateProps {
  countryCode: string
}

export default function YgnMemoriesTemplate({
  countryCode,
}: YgnMemoriesTemplateProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState<UserVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<UserVideo | null>(null)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)

  // 加载用户视频列表
  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      setLoading(true)
      const response = await videoApi.getMyVideos()
      setVideos(response.videos || [])
    } catch (error) {
      console.error("加载视频列表失败:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVideos = videos.filter((video) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return video.title.toLowerCase().includes(q)
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

  const handlePlay = (video: UserVideo) => {
    if (video.status === "completed" && video.video_url) {
      setSelectedVideo(video)
      setShowVideoPlayer(true)
    }
  }

  const handleDownload = (video: UserVideo) => {
    if (video.video_url) {
      const link = document.createElement("a")
      link.href = video.video_url
      link.download = `${video.title}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">已完成</span>
      case "processing":
        return <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">处理中</span>
      case "pending":
        return <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded">等待中</span>
      case "failed":
        return <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">失败</span>
      default:
        return null
    }
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
                {videos.length} 个回忆视频
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Video List */}
        {!loading && (
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
                    className={`relative aspect-video bg-gray-200 ${video.status === "completed" ? "cursor-pointer" : ""}`}
                    onClick={() => video.status === "completed" && handlePlay(video)}
                  >
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="18" x="3" y="3" rx="2" />
                          <path d="m10 8 6 4-6 4V8z" />
                        </svg>
                      </div>
                    )}

                    {/* Play button overlay - only for completed videos */}
                    {video.status === "completed" && video.video_url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#f97316" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="6 3 20 12 6 21 6 3" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Processing overlay */}
                    {video.status === "processing" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                          <p className="text-white text-sm mt-2">处理中...</p>
                        </div>
                      </div>
                    )}

                    {/* Duration badge */}
                    {video.duration > 0 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                        {formatDuration(video.duration)}
                      </div>
                    )}

                    {/* Status badge */}
                    <div className="absolute top-2 left-2">
                      {getStatusBadge(video.status)}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{video.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(video.created_at)}</p>

                    {/* Error message */}
                    {video.status === "failed" && video.error_message && (
                      <p className="text-xs text-red-500 mt-2">{video.error_message}</p>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-3">
                      {video.status === "completed" && video.video_url && (
                        <>
                          <button
                            onClick={() => handlePlay(video)}
                            className="flex-1 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            播放
                          </button>
                          <button
                            onClick={() => handleDownload(video)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            下载
                          </button>
                        </>
                      )}
                      {video.status === "processing" && (
                        <button
                          onClick={() => loadVideos()}
                          className="flex-1 py-2 bg-blue-100 text-blue-600 text-sm rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          刷新状态
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Video Player Modal */}
        {showVideoPlayer && selectedVideo && selectedVideo.video_url && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideoPlayer(false)}
          >
            <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowVideoPlayer(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
              <video
                src={selectedVideo.video_url}
                controls
                autoPlay
                className="w-full rounded-lg"
              >
                您的浏览器不支持视频播放
              </video>
              <div className="mt-4 text-white">
                <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
                <p className="text-sm text-gray-300 mt-1">{formatDate(selectedVideo.created_at)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation countryCode={countryCode} currentPage="memories" />
    </div>
  )
}
