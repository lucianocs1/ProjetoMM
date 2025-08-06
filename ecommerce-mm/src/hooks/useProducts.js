import { useState, useEffect, useCallback } from 'react'
import { productService } from '../services/apiService'

export const useProducts = (category = null) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log(`🔄 Fetching products${category ? ` for category: ${category}` : ''}...`)
      
      let data
      if (category) {
        data = await productService.getByCategory(category)
        console.log(`✅ Products loaded from API for category ${category}:`, data.length, 'items')
      } else {
        data = await productService.getAll()
        console.log('✅ All products loaded from API:', data.length, 'items')
      }
      
      // Normalizar dados sem filtro extra
      const normalizedProducts = data.map(product => {
        const name = product.name || product.nome || ''
        const description = product.description || product.descricao || ''
        const price = Number(product.price ?? product.preco ?? 0)
        const originalPrice = Number(product.originalPrice ?? product.precoOriginal ?? 0)
        const image = product.image || product.imagem || (Array.isArray(product.images) ? product.images[0] : '')
        let sizes = []
        if (Array.isArray(product.sizes)) sizes = product.sizes
        else if (typeof product.sizes === 'string') {
          try { sizes = JSON.parse(product.sizes) } catch { sizes = [] }
        } else if (Array.isArray(product.tamanhos)) sizes = product.tamanhos
        else if (typeof product.tamanhos === 'string') {
          try { sizes = JSON.parse(product.tamanhos) } catch { sizes = [] }
        }
        const category = product.category || product.categoria || ''
        const isNew = Boolean(product.isNew ?? product.novo ?? product.IsNew)
        // Não filtrar por isActive, exibir tudo que vier do backend
        return {
          id: product.id,
          name,
          description,
          price,
          originalPrice,
          image,
          sizes,
          category,
          isNew
        }
      })
      setProducts(normalizedProducts)
    } catch (err) {
      console.warn('⚠️ Error loading products, using fallback:', err.message)
      setError(`Backend indisponível: ${err.message}`)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [category]) // Incluir category nas dependências do useCallback

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts]) // Usar fetchProducts como dependência

  return { products, loading, error, refetch: fetchProducts }
}

// Hook para buscar produtos em destaque
export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Fetching featured products...')
      const data = await productService.getFeatured()
      console.log('✅ Featured products loaded:', data.length, 'items')
      
      // Normalizar dados
      const normalizedProducts = data.map(product => {
        const name = product.name || product.nome || ''
        const description = product.description || product.descricao || ''
        const price = Number(product.price ?? product.preco ?? 0)
        const originalPrice = Number(product.originalPrice ?? product.precoOriginal ?? 0)
        const image = product.image || product.imagem || (Array.isArray(product.images) ? product.images[0] : '')
        let sizes = []
        if (Array.isArray(product.sizes)) sizes = product.sizes
        else if (typeof product.sizes === 'string') {
          try { sizes = JSON.parse(product.sizes) } catch { sizes = [] }
        } else if (Array.isArray(product.tamanhos)) sizes = product.tamanhos
        else if (typeof product.tamanhos === 'string') {
          try { sizes = JSON.parse(product.tamanhos) } catch { sizes = [] }
        }
        const category = product.category || product.categoria || ''
        const isNew = Boolean(product.isNew ?? product.novo ?? product.IsNew)
        const isFeatured = Boolean(product.isFeatured ?? product.IsFeatured)
        
        return {
          id: product.id,
          name,
          description,
          price,
          originalPrice,
          image,
          sizes,
          category,
          isNew,
          isFeatured
        }
      })
      
      setProducts(normalizedProducts)
    } catch (err) {
      console.warn('⚠️ Error loading featured products:', err.message)
      setError(`Backend indisponível: ${err.message}`)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFeaturedProducts()
  }, [fetchFeaturedProducts])

  return { products, loading, error, refetch: fetchFeaturedProducts }
}

// Hook para buscar produtos por categoria
export const useProductsByCategory = (category) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!category) return

    const fetchCategoryProducts = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await ecommerceApi.getProductsWithFallback(category)
        setProducts(data || [])
      } catch (apiError) {
        setError(apiError.message)
        console.error('Erro ao carregar produtos da categoria:', apiError)
      }
      
      setLoading(false)
    }

    fetchCategoryProducts()
  }, [category])

  return {
    products,
    loading,
    error
  }
}

// Hook para buscar produto específico
export const useProduct = (id) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await ecommerceApi.getProductById(id)
        setProduct(data)
      } catch (apiError) {
        setError(apiError.message)
        console.error('Erro ao carregar produto:', apiError)
      }
      
      setLoading(false)
    }

    fetchProduct()
  }, [id])

  return {
    product,
    product,
    loading,
    error
  }
}
