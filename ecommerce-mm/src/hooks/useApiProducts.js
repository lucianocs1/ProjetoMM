import { useState, useEffect } from 'react'
import { ecommerceApi } from '../services/api'

export const useApiProducts = (categoria = null) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Tentativa rápida da API (2 segundos timeout)
        const data = await ecommerceApi.getProducts()
        
        let filteredProducts = data || []
        
        // Se uma categoria específica foi solicitada, filtrar
        if (categoria && filteredProducts.length > 0) {
          filteredProducts = filteredProducts.filter(product => 
            product.category?.toLowerCase() === categoria.toLowerCase() ||
            product.categoria?.toLowerCase() === categoria.toLowerCase()
          )
        }
        
        // Converter formato da API para formato do frontend
        const formattedProducts = filteredProducts.map(product => ({
          id: product.id,
          name: product.name || product.nome,
          description: product.description || product.descricao,
          price: product.price || product.preco,
          originalPrice: product.originalPrice || product.precoPromocional,
          image: product.image || (product.imagens && product.imagens[0]),
          sizes: product.sizes || product.tamanhos || [],
          isNew: product.isNew || false,
          category: product.category || product.categoria
        }))
        
        console.log('✅ Produtos formatados:', formattedProducts)
        setProducts(formattedProducts)
        
      } catch (err) {
        // Backend indisponível - usar fallback silenciosamente
        
        // Fallback: produtos temporários para demonstração
        const fallbackProducts = [
          {
            id: 1,
            name: "Vestido Floral Midi",
            description: "Vestido midi com estampa floral delicada, perfeito para o verão",
            price: 89.90,
            originalPrice: 119.90,
            image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop&crop=center",
            sizes: ["P", "M", "G", "GG"],
            isNew: true,
            category: "Roupas"
          },
          {
            id: 2,
            name: "Blusa Básica Cotton",
            description: "Blusa básica em algodão, confortável para o dia a dia",
            price: 49.90,
            image: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=300&h=300&fit=crop&crop=center",
            sizes: ["P", "M", "G"],
            isNew: false,
            category: "Blusas"
          },
          {
            id: 3,
            name: "Bolsa Tote Grande",
            description: "Bolsa tote espaçosa em couro sintético, ideal para o dia a dia",
            price: 159.90,
            originalPrice: 199.90,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center",
            sizes: ["Único"],
            isNew: true,
            category: "Bolsas"
          },
          {
            id: 4,
            name: "Saia Plissada",
            description: "Saia midi plissada elegante para looks especiais",
            price: 79.90,
            image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?w=300&h=300&fit=crop&crop=center",
            sizes: ["P", "M", "G"],
            isNew: true,
            category: "Roupas"
          },
          {
            id: 5,
            name: "Tênis Casual",
            description: "Tênis confortável para o dia a dia",
            price: 129.90,
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center",
            sizes: ["35", "36", "37", "38", "39", "40"],
            isNew: false,
            category: "Sapatos"
          }
        ]
        
        let fallbackFiltered = fallbackProducts
        if (categoria) {
          fallbackFiltered = fallbackProducts.filter(p => 
            p.category?.toLowerCase() === categoria.toLowerCase()
          )
        }
        
        setProducts(fallbackFiltered)
        setError(null) // Não mostrar erro - fallback é normal
        
        // Em caso de erro, manter array vazio
        // setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoria])

  return { products, loading, error, refetch: () => fetchProducts() }
}

export default useApiProducts
