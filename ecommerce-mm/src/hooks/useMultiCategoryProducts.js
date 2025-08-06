import { useState, useEffect, useCallback, useMemo } from 'react'
import { productService } from '../services/apiService'

export const useMultiCategoryProducts = (categories = []) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Memoizar as categorias para evitar re-renders desnecessários
  const memoizedCategories = useMemo(() => categories, [JSON.stringify(categories)])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log(`🔄 Fetching products for multiple categories:`, memoizedCategories)
      
      // Buscar produtos de cada categoria
      const allProductsPromises = memoizedCategories.map(category => 
        productService.getByCategory(category).catch(err => {
          console.warn(`⚠️ Error fetching category ${category}:`, err.message)
          return []
        })
      )
      
      const categoriesProducts = await Promise.all(allProductsPromises)
      
      // Combinar produtos de todas as categorias
      const combinedProducts = categoriesProducts.flat()
      
      // Remover duplicatas baseado no ID
      const uniqueProducts = combinedProducts.filter((product, index, array) => 
        array.findIndex(p => p.id === product.id) === index
      )
      
      console.log(`✅ Multi-category products loaded:`, uniqueProducts.length, 'items from categories:', memoizedCategories)
      
      // Normalizar dados
      const normalizedProducts = uniqueProducts.map(product => {
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
          isFeatured: product.isFeatured || false,
          createdAt: product.createdAt
        }
      })
      
      setProducts(normalizedProducts)
    } catch (err) {
      console.error('❌ Error fetching multi-category products:', err)
      setError('Erro ao carregar produtos')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [memoizedCategories])

  useEffect(() => {
    if (memoizedCategories.length > 0) {
      fetchProducts()
    } else {
      setProducts([])
      setLoading(false)
    }
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  }
}
