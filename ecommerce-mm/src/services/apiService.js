// Configuração da API
const API_BASE_URL = 'http://localhost:5006/api'

// Cliente HTTP simples
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options,
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // Increased timeout
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.warn(`⚠️ API Error for ${endpoint}:`, {
        message: error.message,
        type: error.name,
        url: url,
        timestamp: new Date().toISOString()
      })
      
      if (error.name === 'AbortError') {
        throw new Error('BACKEND_UNAVAILABLE')
      }
      throw error
    }
  }
}

// Instância do cliente
const apiClient = new ApiClient(API_BASE_URL)

// Serviços de API
export const productService = {
  // Buscar todos os produtos
  async getAll() {
    try {
      const data = await apiClient.request('/products')
      
      // Tratar diferentes formatos de resposta
      if (Array.isArray(data)) {
        return data
      }
      if (data?.value && Array.isArray(data.value)) {
        return data.value
      }
      if (data?.data && Array.isArray(data.data)) {
        return data.data
      }
      
      return []
    } catch (error) {
      if (error.message === 'BACKEND_UNAVAILABLE') {
        return this.getFallbackProducts()
      }
      throw error
    }
  },

  // Buscar produtos por categoria usando o slug diretamente
  async getByCategory(categoryName) {
    try {
      // Usar diretamente o nome da categoria como slug
      const slug = categoryName.toLowerCase()
      console.log(`🔄 Fetching products for category slug: ${slug}`)
      
      const data = await apiClient.request(`/products/category/${slug}`)
      console.log(`✅ Category API response:`, data.length, 'products')
      
      if (Array.isArray(data)) return data
      if (data?.value && Array.isArray(data.value)) return data.value
      if (data?.data && Array.isArray(data.data)) return data.data
      return []
    } catch (error) {
      console.warn(`⚠️ Error fetching category ${categoryName}:`, error.message)
      return []
    }
  },

  // Buscar produtos em destaque
  async getFeatured() {
    try {
      console.log('🔄 Fetching featured products...')
      const data = await apiClient.request('/products?featured=true')
      console.log('✅ Featured products response:', data.length, 'products')
      
      if (Array.isArray(data)) return data
      if (data?.value && Array.isArray(data.value)) return data.value
      if (data?.data && Array.isArray(data.data)) return data.data
      return []
    } catch (error) {
      console.warn('⚠️ Error fetching featured products:', error.message)
      return []
    }
  },

  // Nenhum fallback, só produtos do banco
}

export const categoryService = {
  async getAll() {
    try {
      return await apiClient.request('/categories')
    } catch (error) {
      return [
        { id: 1, name: "Roupas", slug: "roupas" },
        { id: 2, name: "Blusas", slug: "blusas" },
        { id: 3, name: "Bolsas", slug: "bolsas" },
        { id: 4, name: "Sapatos", slug: "sapatos" }
      ]
    }
  }
}

export default { productService, categoryService }
