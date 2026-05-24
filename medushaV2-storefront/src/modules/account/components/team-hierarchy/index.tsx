"use client"

import { useEffect, useState } from "react"
import { Container, Button, clx } from "@medusajs/ui"

interface TeamMember {
  id: string
  customer_id: string
  email: string
  level: number
  created_at: string
}

export default function TeamHierarchy() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTeamData()
  }, [])

  const loadTeamData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/store/referrals", {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        // Load referrals data
        setTeamMembers(data.my_referrals || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team data")
    } finally {
      setLoading(false)
    }
  }

  const getLevelBadge = (level: number) => {
    const styles: Record<number, string> = {
      1: "bg-green-100 text-green-800",
      2: "bg-blue-100 text-blue-800",
      3: "bg-purple-100 text-purple-800",
    }
    return styles[level] || "bg-gray-100 text-gray-800"
  }

  const getLevelName = (level: number) => {
    const names: Record<number, string> = {
      1: "一级推荐",
      2: "二级推荐",
      3: "三级推荐",
    }
    return names[level] || `Level ${level}`
  }

  if (loading) {
    return (
      <Container className="py-8">
        <div className="flex justify-center">
          <div className="animate-pulse text-gray-500">加载团队数据...</div>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="text-center text-red-500">{error}</div>
      </Container>
    )
  }

  // Group by level
  const level1 = teamMembers.filter(m => m.level === 1)
  const level2 = teamMembers.filter(m => m.level === 2)
  const level3 = teamMembers.filter(m => m.level === 3)

  return (
    <Container className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">我的团队</h1>
        <p className="text-gray-600">
          查看您的推荐团队成员和下级关系
        </p>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-gray-500">一级推荐</div>
          <div className="text-2xl font-bold text-green-700">{level1.length}</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-500">二级推荐</div>
          <div className="text-2xl font-bold text-blue-700">{level2.length}</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="text-sm text-gray-500">三级推荐</div>
          <div className="text-2xl font-bold text-purple-700">{level3.length}</div>
        </div>
      </div>

      {teamMembers.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>暂无团队成员</p>
          <p className="text-sm mt-2">分享您的推荐码，邀请更多用户加入</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Level 1 */}
          {level1.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">一级</span>
                一级推荐 ({level1.length}人)
              </h3>
              <div className="space-y-2">
                {level1.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{member.email || "用户"}</div>
                      <div className="text-sm text-gray-500">
                        注册时间: {new Date(member.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={clx("px-2 py-1 text-sm rounded", getLevelBadge(member.level))}>
                      {getLevelName(member.level)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level 2 */}
          {level2.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">二级</span>
                二级推荐 ({level2.length}人)
              </h3>
              <div className="space-y-2">
                {level2.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{member.email || "用户"}</div>
                      <div className="text-sm text-gray-500">
                        注册时间: {new Date(member.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={clx("px-2 py-1 text-sm rounded", getLevelBadge(member.level))}>
                      {getLevelName(member.level)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level 3 */}
          {level3.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded">三级</span>
                三级推荐 ({level3.length}人)
              </h3>
              <div className="space-y-2">
                {level3.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">{member.email || "用户"}</div>
                      <div className="text-sm text-gray-500">
                        注册时间: {new Date(member.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={clx("px-2 py-1 text-sm rounded", getLevelBadge(member.level))}>
                      {getLevelName(member.level)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Container>
  )
}