import { apiRequest } from './api.js'

// Service para produtos - integração com .NET Backend
export const productService = {
  // GET /api/products
  getAllProducts: async () => {
    return await apiRequest('/products')
  },

  // GET /api/products/{id}
  getProductById: async (id) => {
    return await apiRequest(`/products/${id}`)
  },

  // GET /api/products/category/{category}
  getProductsByCategory: async (category) => {
    return await apiRequest(`/products/category/${category}`)
  },

  // POST /api/products/search
  searchProducts: async (searchTerm) => {
    return await apiRequest('/products/search', {
      method: 'POST',
      data: { searchTerm }
    })
  },

  // Estrutura esperada do produto para o .NET
  productModel: {
    id: 0,
    nome: '',
    descricao: '',
    preco: 0.0,
    categoria: '',
    tamanhos: [],
    imagens: [],
    tags: [],
    promocoes: '',
    ativo: true,
    criadoEm: '',
    atualizadoEm: ''
  }
}

// Service para categorias
export const categoryService = {
  // GET /api/categories
  getAllCategories: async () => {
    return await apiRequest('/categories')
  },

  // GET /api/categories/{id}/products
  getCategoryProducts: async (categoryId) => {
    return await apiRequest(`/categories/${categoryId}/products`)
  }
}
