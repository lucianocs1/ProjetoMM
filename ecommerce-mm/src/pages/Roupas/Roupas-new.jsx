import { useState, useMemo } from 'react'
import { Container, Typography, Grid, Box, Chip, CircularProgress, Alert } from '@mui/material'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductFilters from '../../components/ProductFilters/ProductFilters'
import useApiProducts from '../../hooks/useApiProducts'

const Roupas = () => {
  const { products, loading, error } = useApiProducts('Roupas')
  
  console.log('👔 Roupas - produtos:', products?.length, 'loading:', loading, 'error:', error)
  
  const [filters, setFilters] = useState({
    search: '',
    priceRange: [0, 300],
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

    // Filtro de faixa de preço
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price?.toString().replace(',', '.') || 0)
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Filtro de tamanhos
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes?.some(size => filters.sizes.includes(size))
      )
    }

    // Filtro de produtos novos
    if (filters.isNew) {
      filtered = filtered.filter(product => product.isNew)
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          const priceA = parseFloat(a.price?.toString().replace(',', '.') || 0)
          const priceB = parseFloat(b.price?.toString().replace(',', '.') || 0)
          return priceA - priceB
        case 'price_desc':
          const priceDescA = parseFloat(a.price?.toString().replace(',', '.') || 0)
          const priceDescB = parseFloat(b.price?.toString().replace(',', '.') || 0)
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
          Roupas
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Moda feminina com estilo e personalidade
        </Typography>
      </Box>

      {/* Filtros */}
      <ProductFilters 
        filters={filters}
        onFiltersChange={setFilters} 
        availableSizes={['PP', 'P', 'M', 'G', 'GG']}
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
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid xs={12} sm={6} md={4} lg={3} key={product.id}>
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
        <Typography variant="h5" gutterBottom color="primary">
          Nossa Coleção de Roupas
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Descubra as últimas tendências em moda feminina na nossa coleção de roupas. 
          Desde vestidos elegantes até peças casuais para o dia a dia, temos tudo o que você precisa 
          para expressar seu estilo único.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Todas as peças são cuidadosamente selecionadas para oferecer qualidade, conforto e estilo.
        </Typography>
      </Box>
    </Container>
  )
}

export default Roupas
