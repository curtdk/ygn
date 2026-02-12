// API服务配置
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000'

// 产品相关API
export const productApi = {
  // 获取所有产品
  async getProducts() {
    const response = await fetch(`${API_BASE_URL}/store/products`, {
      credentials: 'include'
    })
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  },

  // 获取产品详情
  async getProduct(productId: string) {
    const response = await fetch(`${API_BASE_URL}/store/products/${productId}`, {
      credentials: 'include'
    })
    if (!response.ok) throw new Error('Failed to fetch product')
    return response.json()
  },

  // 获取产品的可替换素材
  async getProductMaterials(productId: string) {
    const response = await fetch(`${API_BASE_URL}/store/products/${productId}/materials`, {
      credentials: 'include'
    })
    if (!response.ok) throw new Error('Failed to fetch materials')
    return response.json()
  }
}

// 视频生成相关API
export const videoApi = {
  // 创建视频生成任务
  async createVideoGeneration(data: {
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
    if (!response.ok) throw new Error('Failed to create video generation')
    return response.json()
  },

  // 获取用户的视频列表
  async getMyVideos() {
    const response = await fetch(`${API_BASE_URL}/store/my-videos`, {
      credentials: 'include'
    })
    if (!response.ok) throw new Error('Failed to fetch videos')
    return response.json()
  }
}

// 文件上传API
export const uploadApi = {
  // 上传文件
  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/store/uploads`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
    if (!response.ok) throw new Error('Failed to upload file')
    return response.json()
  }
}
