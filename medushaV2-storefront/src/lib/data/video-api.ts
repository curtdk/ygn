const API_BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ''

// 通用请求头
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-publishable-api-key': PUBLISHABLE_KEY,
})

// 产品相关API
export const productApi = {
  // 获取所有产品
  async getProducts(collectionId?: string) {
    const url = collectionId
      ? `${API_BASE_URL}/store/products?collection_id[]=${collectionId}`
      : `${API_BASE_URL}/store/products`

    const response = await fetch(url, {
      credentials: 'include',
      headers: getHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  },

  // 获取产品详情
  async getProduct(productId: string) {
    const response = await fetch(`${API_BASE_URL}/store/products/${productId}`, {
      credentials: 'include',
      headers: getHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch product')
    return response.json()
  },

  // 获取产品的可替换素材
  async getProductMaterials(productId: string) {
    const response = await fetch(`${API_BASE_URL}/store/products/${productId}/materials`, {
      credentials: 'include',
      headers: getHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch materials')
    return response.json()
  },

  // 获取所有分类
  async getCollections() {
    const response = await fetch(`${API_BASE_URL}/store/collections`, {
      credentials: 'include',
      headers: getHeaders(),
    })
    if (!response.ok) throw new Error('Failed to fetch collections')
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
      headers: getHeaders(),
      body: JSON.stringify(data),
      credentials: 'include'
    })
    if (!response.ok) throw new Error('Failed to create video generation')
    return response.json()
  },

  // 获取用户的视频列表
  async getMyVideos() {
    const response = await fetch(`${API_BASE_URL}/store/my-videos`, {
      credentials: 'include',
      headers: getHeaders(),
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
    formData.append('files', file)

    // 使用store端点
    const response = await fetch(`${API_BASE_URL}/store/uploads`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
      }
    })
    if (!response.ok) throw new Error('Failed to upload file')
    const result = await response.json()

    // 后台返回格式: { files: [{ url, key, ... }] }
    // 返回第一个文件的信息
    if (result.files && result.files.length > 0) {
      return result.files[0]
    }
    throw new Error('No file returned from upload')
  }
}
