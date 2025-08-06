import { useState, useMemo } from 'react'
import { Container, Typography, Grid, Box, Chip, CircularProgress, Alert } from '@mui/material'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductFilters from '../../components/ProductFilters/ProductFilters'
import { useProducts } from '../../hooks/useProducts'

const Sapatos = () => {
  const { products: allProducts, loading, error } = useProducts()
  // Filtrar sapatos no frontend
  const products = useMemo(() =>
    allProducts.filter(p => {
      const cat = (p.category || p.Category || p.categoria || '').toString().trim().toLowerCase()
      const slug = (p.slug || p.Slug || '').toString().trim().toLowerCase()
      const categoryId = Number(p.categoryId || p.CategoryId || p.categoriaId)
      return cat === 'sapatos' || slug === 'sapatos' || categoryId === 4
    }),
    [allProducts]
  )
  
  const [filters, setFilters] = useState({
    search: '',
    priceRange: [0, 2000],
    sizes: [],
    sortBy: 'name',
    isNew: false,
  })

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filtro de busca
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Filtro de preço
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price?.toString().replace(',', '.') || product.actualPrice || 0)
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Filtro de tamanhos
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes && product.sizes.some(size => filters.sizes.includes(size))
      )
    }

    // Filtro de novos
    if (filters.isNew) {
      filtered = filtered.filter(product => product.isNew)
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          const priceA = parseFloat(a.price?.toString().replace(',', '.') || a.actualPrice || 0)
          const priceB = parseFloat(b.price?.toString().replace(',', '.') || b.actualPrice || 0)
          return priceA - priceB
        case 'price_desc':
          const priceDescA = parseFloat(a.price?.toString().replace(',', '.') || a.actualPrice || 0)
          const priceDescB = parseFloat(b.price?.toString().replace(',', '.') || b.actualPrice || 0)
          return priceDescB - priceDescA
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [products, filters])

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Sapatos
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Calçados que combinam estilo e conforto
        </Typography>
      </Box>

      {/* Filtros */}
      <ProductFilters 
        onFiltersChange={setFilters} 
        products={products}
      />

      {/* Resultados */}
      <Box sx={{ mb: 4 }}>
        <Chip 
          label={`${filteredProducts.length} produto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      {/* Products Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          Erro ao carregar produtos: {error}
        </Alert>
      ) : filteredProducts.length > 0 ? (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum produto encontrado com os filtros selecionados.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Tente ajustar os filtros para ver mais resultados.
          </Typography>
        </Box>
      )}

      {/* Info Section */}
      <Box sx={{ mt: 8, p: 4, backgroundColor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Nossa Coleção de Calçados
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Descubra nossa linha completa de calçados femininos, pensada para mulheres que valorizam 
          qualidade e estilo. De scarpins elegantes a tênis casuais, temos opções para todas as 
          ocasiões. Todos os nossos sapatos são cuidadosamente selecionados para garantir conforto 
          e durabilidade.
        </Typography>
      </Box>
    </Container>
  )
}

export default Sapatos
