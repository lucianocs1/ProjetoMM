import { useState, useMemo } from 'react'
import { Container, Typography, Grid, Box, Chip } from '@mui/material'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductFilters from '../../components/ProductFilters/ProductFilters'
import { sapatosData } from '../../data/products'

const Sapatos = () => {
  const [filters, setFilters] = useState({
    search: '',
    priceRange: [0, 300],
    sizes: [],
    sortBy: 'name',
    isNew: false,
  })

  const filteredProducts = useMemo(() => {
    let filtered = [...sapatosData]

    // Filtro de busca
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Filtro de preço
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price.replace(',', '.'))
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
          Sapatos
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Calçados que combinam estilo e conforto
        </Typography>
      </Box>

      {/* Filtros */}
      <ProductFilters 
        onFiltersChange={setFilters} 
        products={sapatosData}
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
