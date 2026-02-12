// 前端API集成示例
// 将这些函数添加到你的React项目中

// ============================================
// API配置
// ============================================

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9000'

// ============================================
// 视频生成相关API
// ============================================

/**
 * 获取产品的可替换素材列表
 * @param productId 产品ID
 */
export async function getProductMaterials(productId: string) {
  const response = await fetch(`${API_BASE_URL}/store/products/${productId}/materials`, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch materials')
  }

  return response.json()
}

/**
 * 上传素材文件
 * @param file 文件对象
 */
export async function uploadMaterial(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/store/uploads`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to upload file')
  }

  return response.json()
}

/**
 * 创建视频生成任务
 * @param data 视频生成数据
 */
export async function createVideoGeneration(data: {
  product_id: string
  title: string
  materials_used: Record<string, any>
}) {
  const response = await fetch(`${API_BASE_URL}/store/video-generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to create video generation')
  }

  return response.json()
}

/**
 * 获取用户的视频列表
 */
export async function getMyVideos() {
  const response = await fetch(`${API_BASE_URL}/store/my-videos`, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch videos')
  }

  return response.json()
}

/**
 * 获取单个视频详情
 * @param videoId 视频ID
 */
export async function getVideoById(videoId: string) {
  const response = await fetch(`${API_BASE_URL}/store/my-videos/${videoId}`, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch video')
  }

  return response.json()
}

// ============================================
// React Hook 示例
// ============================================

import { useState, useEffect } from 'react'

/**
 * 使用产品素材的Hook
 */
export function useProductMaterials(productId: string | null) {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!productId) return

    setLoading(true)
    getProductMaterials(productId)
      .then(data => {
        setMaterials(data.materials || [])
        setError(null)
      })
      .catch(err => {
        setError(err)
        setMaterials([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [productId])

  return { materials, loading, error }
}

/**
 * 使用用户视频列表的Hook
 */
export function useMyVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchVideos = () => {
    setLoading(true)
    getMyVideos()
      .then(data => {
        setVideos(data.videos || [])
        setError(null)
      })
      .catch(err => {
        setError(err)
        setVideos([])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  return { videos, loading, error, refetch: fetchVideos }
}

// ============================================
// 使用示例
// ============================================

/**
 * 示例1: 在ConfigureRole页面中使用
 */
export function ConfigureRoleExample() {
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('scene')

  // 使用Hook获取素材
  const { materials, loading, error } = useProductMaterials(productId)

  // 存储用户选择的素材
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, any>>({})

  // 初始化默认素材
  useEffect(() => {
    if (materials.length > 0) {
      const defaults: Record<string, any> = {}
      materials.forEach((m: any) => {
        defaults[m.material_key] = {
          original_url: m.default_url,
          replaced_url: null,
          type: m.material_type
        }
      })
      setSelectedMaterials(defaults)
    }
  }, [materials])

  // 处理素材替换
  const handleMaterialReplace = async (materialKey: string, file: File) => {
    try {
      const result = await uploadMaterial(file)

      setSelectedMaterials(prev => ({
        ...prev,
        [materialKey]: {
          ...prev[materialKey],
          replaced_url: result.url
        }
      }))
    } catch (error) {
      console.error('Upload failed:', error)
      alert('上传失败，请重试')
    }
  }

  // 生成视频
  const handleGenerate = async () => {
    try {
      const result = await createVideoGeneration({
        product_id: productId!,
        title: '我的视频',
        materials_used: selectedMaterials
      })

      // 跳转到生成页面
      navigate(`/generate?videoId=${result.video.id}`)
    } catch (error) {
      console.error('Generation failed:', error)
      alert('生成失败，请重试')
    }
  }

  if (loading) return <div>加载中...</div>
  if (error) return <div>加载失败: {error.message}</div>

  return (
    <div>
      {materials.map((material: any) => (
        <div key={material.id}>
          <h3>{material.name}</h3>
          <img src={selectedMaterials[material.material_key]?.replaced_url || material.default_url} />
          {material.is_replaceable && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleMaterialReplace(material.material_key, file)
                }
              }}
            />
          )}
        </div>
      ))}
      <button onClick={handleGenerate}>生成视频</button>
    </div>
  )
}

/**
 * 示例2: 在Memories页面中使用
 */
export function MemoriesExample() {
  const { videos, loading, error, refetch } = useMyVideos()

  if (loading) return <div>加载中...</div>
  if (error) return <div>加载失败: {error.message}</div>

  return (
    <div>
      <button onClick={refetch}>刷新</button>
      {videos.map((video: any) => (
        <div key={video.id}>
          <h3>{video.title}</h3>
          <img src={video.thumbnail_url} alt={video.title} />
          <p>状态: {video.status}</p>
          {video.status === 'completed' && (
            <video src={video.video_url} controls />
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * 示例3: 在GenerateVideo页面中轮询状态
 */
export function GenerateVideoExample() {
  const [searchParams] = useSearchParams()
  const videoId = searchParams.get('videoId')

  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!videoId) return

    // 轮询检查视频状态
    const interval = setInterval(async () => {
      try {
        const result = await getVideoById(videoId)
        setVideo(result.video)
        setLoading(false)

        // 如果完成或失败，停止轮询
        if (result.video.status === 'completed' || result.video.status === 'failed') {
          clearInterval(interval)
        }
      } catch (error) {
        console.error('Failed to fetch video status:', error)
      }
    }, 3000) // 每3秒检查一次

    return () => clearInterval(interval)
  }, [videoId])

  if (loading) return <div>加载中...</div>

  return (
    <div>
      <h2>{video.title}</h2>
      {video.status === 'pending' && <p>等待处理...</p>}
      {video.status === 'processing' && <p>正在生成视频...</p>}
      {video.status === 'completed' && (
        <div>
          <p>生成完成！</p>
          <video src={video.video_url} controls />
        </div>
      )}
      {video.status === 'failed' && (
        <div>
          <p>生成失败: {video.error_message}</p>
        </div>
      )}
    </div>
  )
}
