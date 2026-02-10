"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import BottomNavigation from "@modules/ygn/components/bottom-navigation"

interface YgnSettingsTemplateProps {
  countryCode: string
}

export default function YgnSettingsTemplate({
  countryCode,
}: YgnSettingsTemplateProps) {
  const router = useRouter()
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [userAvatar, setUserAvatar] = useState<string | null>(null)
  const [userName, setUserName] = useState("忆光年用户")
  const [tempUserName, setTempUserName] = useState("")
  const [tempAvatar, setTempAvatar] = useState<string | null>(null)
  const [resetStep, setResetStep] = useState(1)
  const [countdown, setCountdown] = useState(0)
  const [resetData, setResetData] = useState({
    phone: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      if (showProfileEdit) {
        setTempAvatar(result)
      } else {
        setUserAvatar(result)
      }
    }
    reader.readAsDataURL(file)
  }, [showProfileEdit])

  const handleSendCode = () => {
    if (!resetData.phone || resetData.phone.length !== 11) {
      alert("请输入正确的手机号")
      return
    }
    setCountdown(60)
    alert("验证码已发送")
  }

  const handleResetPassword = () => {
    if (resetStep === 1) {
      if (!resetData.phone || !resetData.code) {
        alert("请填写手机号和验证码")
        return
      }
      setResetStep(2)
      return
    }
    if (!resetData.newPassword || !resetData.confirmPassword) {
      alert("请填写新密码")
      return
    }
    if (resetData.newPassword !== resetData.confirmPassword) {
      alert("两次密码不一致")
      return
    }
    if (resetData.newPassword.length < 6) {
      alert("密码长度不能少于6位")
      return
    }
    alert("密码重置成功")
    setShowPasswordReset(false)
    setResetStep(1)
    setResetData({ phone: "", code: "", newPassword: "", confirmPassword: "" })
  }

  const handleSaveProfile = () => {
    if (tempUserName.trim()) {
      setUserName(tempUserName.trim())
    }
    if (tempAvatar) {
      setUserAvatar(tempAvatar)
    }
    setShowProfileEdit(false)
    setTempAvatar(null)
    alert("个人信息已更新")
  }

  const handleLogout = () => {
    if (confirm("确定要退出登录吗？")) {
      router.push(`/${countryCode}/`)
    }
  }

  const openProfileEdit = () => {
    setTempUserName(userName)
    setTempAvatar(userAvatar)
    setShowProfileEdit(true)
  }

  const settingsItems = [
    {
      label: "亲人管理",
      desc: "管理您的亲人信息",
      color: "bg-blue-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      onClick: () => router.push(`/${countryCode}/ygn/person-manager`),
    },
    {
      label: "积分充值",
      desc: "购买积分创作更多回忆",
      color: "bg-green-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">$</text>
        </svg>
      ),
      onClick: () => router.push(`/${countryCode}/ygn/recharge`),
    },
    {
      label: "隐私设置",
      desc: "管理您的隐私偏好",
      color: "bg-purple-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      onClick: () => alert("功能开发中"),
    },
    {
      label: "意见反馈",
      desc: "帮助我们改进产品",
      color: "bg-orange-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      onClick: () => alert("功能开发中"),
    },
    {
      label: "关于应用",
      desc: "版本信息与更新",
      color: "bg-blue-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
      onClick: () => alert("忆光年 v1.0.0"),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto">
        {/* Hidden file input */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-5 pt-12 pb-6">
          <h1 className="text-xl font-bold text-white text-center">设置</h1>
        </div>

        {/* Profile Card */}
        <div className="px-4 -mt-3">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center overflow-hidden">
                  {userAvatar ? (
                    <img src={userAvatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">{userName}</h2>
                <p className="text-sm text-gray-400">点击编辑个人信息</p>
              </div>
              <button
                onClick={openProfileEdit}
                className="px-3 py-1.5 text-sm text-orange-500 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
              >
                编辑
              </button>
            </div>
          </div>
        </div>

        {/* Profile Edit Inline Form */}
        {showProfileEdit && (
          <div className="px-4 mt-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-4">编辑个人信息</h3>
              <div className="flex flex-col items-center mb-4">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center overflow-hidden">
                    {(tempAvatar || userAvatar) ? (
                      <img src={tempAvatar || userAvatar || ""} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}
                  </div>
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-400">点击更换头像</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">用户名</label>
                <input
                  type="text"
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                  placeholder="请输入用户名"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowProfileEdit(false); setTempAvatar(null) }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings List */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {settingsItems.map((item, index) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left ${
                  index < settingsItems.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className={`w-9 h-9 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Password Reset Button */}
        <div className="px-4 mt-4">
          <button
            onClick={() => {
              setShowPasswordReset(!showPasswordReset)
              setResetStep(1)
              setResetData({ phone: "", code: "", newPassword: "", confirmPassword: "" })
            }}
            className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-800">重置密码</p>
              <p className="text-xs text-gray-400">修改您的登录密码</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={showPasswordReset ? "M18 15l-6-6-6 6" : "M9 18l6-6-6-6"} />
            </svg>
          </button>
        </div>

        {/* Password Reset Inline Form */}
        {showPasswordReset && (
          <div className="px-4 mt-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-semibold text-gray-800 mb-4">
                {resetStep === 1 ? "验证手机号" : "设置新密码"}
              </h3>

              {resetStep === 1 ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">手机号</label>
                    <input
                      type="tel"
                      value={resetData.phone}
                      onChange={(e) => setResetData({ ...resetData, phone: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                      placeholder="请输入手机号"
                      maxLength={11}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">验证码</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={resetData.code}
                        onChange={(e) => setResetData({ ...resetData, code: e.target.value })}
                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                        placeholder="请输入验证码"
                        maxLength={6}
                      />
                      <button
                        onClick={handleSendCode}
                        disabled={countdown > 0}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap ${
                          countdown > 0
                            ? "bg-gray-100 text-gray-400"
                            : "bg-orange-500 text-white hover:bg-orange-600"
                        } transition-colors`}
                      >
                        {countdown > 0 ? `${countdown}s` : "发送验证码"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">新密码</label>
                    <input
                      type="password"
                      value={resetData.newPassword}
                      onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                      placeholder="请输入新密码（至少6位）"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">确认密码</label>
                    <input
                      type="password"
                      value={resetData.confirmPassword}
                      onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                      placeholder="请再次输入新密码"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    if (resetStep === 2) {
                      setResetStep(1)
                    } else {
                      setShowPasswordReset(false)
                    }
                  }}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  {resetStep === 2 ? "上一步" : "取消"}
                </button>
                <button
                  onClick={handleResetPassword}
                  className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600 transition-colors"
                >
                  {resetStep === 1 ? "下一步" : "确认重置"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="px-4 mt-6 mb-8">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-50 text-red-500 font-medium rounded-2xl border border-red-100 hover:bg-red-100 transition-colors"
          >
            退出登录
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}