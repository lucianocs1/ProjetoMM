import { useState, useEffect } from 'react'
import { productService } from '../services/productService.js'

// Hook para carregar produtos
export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    
    const { data, error: apiError } = await productService.getAllProducts()
    
    if (apiError) {
      setError(apiError)
    } else {
      setProducts(data || [])
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  }
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
      
      const { data, error: apiError } = await productService.getProductsByCategory(category)
      
      if (apiError) {
        setError(apiError)
      } else {
        setProducts(data || [])
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
      
      const { data, error: apiError } = await productService.getProductById(id)
      
      if (apiError) {
        setError(apiError)
      } else {
        setProduct(data)
      }
      
      setLoading(false)
    }

    fetchProduct()
  }, [id])

  return {
    product,
    loading,
    error
  }
}
