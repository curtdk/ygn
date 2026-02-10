"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { RELATIONSHIP_LABELS } from "@/types/ygn"

interface YgnPersonManagerTemplateProps {
  countryCode: string
}

interface PhotoItem {
  id: string
  url: string
  name: string
}

interface VoiceItem {
  id: string
  name: string
  duration: number
}

export default function YgnPersonManagerTemplate({
  countryCode,
}: YgnPersonManagerTemplateProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const defaultRoles = Object.entries(RELATIONSHIP_LABELS).map(
    ([key, label]) => ({
      id: key,
      label,
      isCustom: false,
    })
  )

  const [customRoles, setCustomRoles] = useState<
    { id: string; label: string; isCustom: boolean }[]
  >([])
  const [selectedPerson, setSelectedPerson] = useState(defaultRoles[0].id)
  const [editData, setEditData] = useState({ name: "", age: "", note: "" })
  const [newRoleName, setNewRoleName] = useState("")
  const [isAddingRole, setIsAddingRole] = useState(false)
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [voices, setVoices] = useState<VoiceItem[]>([])
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)

  const allRoles = [...defaultRoles, ...customRoles]

  const handleAddRole = () => {
    if (!newRoleName.trim()) return
    const newRole = {
      id: `custom_${Date.now()}`,
      label: newRoleName.trim(),
      isCustom: true,
    }
    setCustomRoles((prev) => [...prev, newRole])
    setNewRoleName("")
    setIsAddingRole(false)
  }

  const handleDeleteRole = (roleId: string) => {
    setCustomRoles((prev) => prev.filter((r) => r.id !== roleId))
    if (selectedPerson === roleId) {
      setSelectedPerson(defaultRoles[0].id)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result as string
      const newPhoto: PhotoItem = {
        id: `photo_${Date.now()}`,
        url,
        name: file.name,
      }
      setPhotos((prev) => [...prev, newPhoto])
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handleDeletePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId))
  }

  const handleAddVoice = () => {
    const newVoice: VoiceItem = {
      id: `voice_${Date.now()}`,
      name: `录音_${voices.length + 1}.wav`,
      duration: Math.floor(Math.random() * 10) + 3,
    }
    setVoices((prev) => [...prev, newVoice])
  }

  const handleDeleteVoice = (voiceId: string) => {
    setVoices((prev) => prev.filter((v) => v.id !== voiceId))
    if (playingVoice === voiceId) setPlayingVoice(null)
  }

  const handleTogglePlay = (voiceId: string) => {
    setPlayingVoice((prev) => (prev === voiceId ? null : voiceId))
  }

  const handleSave = () => {
    alert("保存成功！")
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-5 pt-12 pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/${countryCode}/ygn/settings`)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">亲人管理</h1>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {allRoles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedPerson(role.id)}
                className={`relative flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedPerson === role.id
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {role.label}
                {role.isCustom && (
                  <span
                    onClick={(e) => { e.stopPropagation(); handleDeleteRole(role.id) }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs leading-none cursor-pointer"
                  >
                    x
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={() => setIsAddingRole(true)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-500 border border-dashed border-gray-300"
            >
              + 添加角色
            </button>
          </div>
          {isAddingRole && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="输入角色名称"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                onKeyDown={(e) => e.key === "Enter" && handleAddRole()}
              />
              <button onClick={handleAddRole} className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm">确定</button>
              <button onClick={() => { setIsAddingRole(false); setNewRoleName("") }} className="px-3 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">取消</button>
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-3">基本信息</h2>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">姓名</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
                  placeholder="请输入姓名"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="w-24">
                <label className="text-xs text-gray-500 mb-1 block">年龄</label>
                <input
                  type="number"
                  value={editData.age}
                  onChange={(e) => setEditData((d) => ({ ...d, age: e.target.value }))}
                  placeholder="年龄"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Photo Management */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-800">照片管理</h2>
              <button onClick={() => fileInputRef.current?.click()} className="text-sm text-orange-500 font-medium">+ 添加照片</button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group aspect-square">
                  <img src={photo.url} alt={photo.name} className="w-full h-full object-cover rounded-lg" />
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >x</button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-400 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="text-xs mt-1">上传</span>
              </button>
            </div>
          </div>
        </div>

        {/* Voice Management */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-800">声音管理</h2>
              <button onClick={handleAddVoice} className="text-sm text-orange-500 font-medium">+ 录音</button>
            </div>
            {voices.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">暂无录音，点击右上角添加</p>
            ) : (
              <div className="space-y-2">
                {voices.map((voice) => (
                  <div key={voice.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                    <button
                      onClick={() => handleTogglePlay(voice.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white flex-shrink-0"
                    >
                      {playingVoice === voice.id ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">{voice.name}</p>
                      <p className="text-xs text-gray-400">{voice.duration}秒</p>
                    </div>
                    <button
                      onClick={() => handleDeleteVoice(voice.id)}
                      className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-3">备注</h2>
            <textarea
              value={editData.note}
              onChange={(e) => setEditData((d) => ({ ...d, note: e.target.value }))}
              placeholder="添加关于此人的备注信息..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="px-4 mt-6">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-transform"
          >
            保存信息
          </button>
        </div>
      </div>
    </div>
  )
}