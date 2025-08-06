import { useState, useEffect } from 'react'
import { productService } from '../services/apiService'

export const useProducts = (category = null) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let data
        if (category) {
          data = await productService.getByCategory(category)
        } else {
          data = await productService.getAll()
        }
        
        // Normalizar dados
        const normalizedProducts = data.map(product => ({
          id: product.id,
          name: product.name || product.nome,
          description: product.description || product.descricao,
          price: Number(product.price || product.preco || 0),
          originalPrice: product.originalPrice || product.precoOriginal,
          image: product.image || product.imagem,
          sizes: Array.isArray(product.sizes) ? product.sizes : 
                 typeof product.sizes === 'string' ? JSON.parse(product.sizes || '[]') :
                 product.tamanhos || [],
          category: product.category || product.categoria,
          isNew: Boolean(product.isNew || product.novo)
        }))
        
        setProducts(normalizedProducts)
      } catch (err) {
        setError(err.message)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  return { products, loading, error, refetch: () => fetchProducts() }
}

export default useProducts
