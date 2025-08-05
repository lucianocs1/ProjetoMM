import { useState, useMemo } from 'react'
import { Container, Typography, Grid, Box, Chip, CircularProgress, Alert } from '@mui/material'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductFilters from '../../components/ProductFilters/ProductFilters'
import { useProductsByCategory } from '../../hooks/useProducts'

const Roupas = () => {
  const { products: roupasData, loading, error } = useProductsByCategory('Roupas')
  
  const [filters, setFilters] = useState({
    search: '',
    priceRange: [0, 300],
    sizes: [],
    sortBy: 'name',
    isNew: false,
  })

  // Loading state
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Container>
    )
  }

  // Error state  
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Erro ao carregar produtos: {error}
        </Alert>
      </Container>
    )
  }

  const filteredProducts = useMemo(() => {
    let filtered = [...roupasData]

    // Filtro de busca
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.descricao.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Filtro de preço
    filtered = filtered.filter(product => {
      const price = parseFloat(product.preco)
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
          return parseFloat(a.price.replace(',', '.')) - parseFloat(b.price.replace(',', '.'))
        case 'price_desc':
          return parseFloat(b.price.replace(',', '.')) - parseFloat(a.price.replace(',', '.'))
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [filters])

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Roupas
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Encontre a peça perfeita para cada ocasião
        </Typography>
      </Box>

      {/* Filtros */}
      <ProductFilters 
        onFiltersChange={setFilters} 
        products={roupasData}
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
      {filteredProducts.length > 0 ? (
        <Grid container spacing={4}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
          Nossa Coleção de Roupas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Descubra nossa variedade de roupas femininas, desde vestidos elegantes até conjuntos modernos. 
          Temos opções para todos os gostos e ocasiões: peças casuais para o dia a dia, 
          roupas sociais para o trabalho e looks especiais para momentos únicos.
        </Typography>
      </Box>
    </Container>
  )
}

export default Roupas
