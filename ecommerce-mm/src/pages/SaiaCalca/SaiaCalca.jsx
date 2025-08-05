import { useState, useMemo } from 'react'
import { Container, Typography, Grid, Box, Chip } from '@mui/material'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductFilters from '../../components/ProductFilters/ProductFilters'
import { saiasCalcasData } from '../../data/products'

const SaiaCalca = () => {
  const [filters, setFilters] = useState({
    search: '',
    priceRange: [0, 300],
    sizes: [],
    sortBy: 'name',
    isNew: false,
  })

  const filteredProducts = useMemo(() => {
    let filtered = [...saiasCalcasData]

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
          Saias & Calças
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Peças versáteis para compor looks incríveis
        </Typography>
      </Box>

      {/* Filtros */}
      <ProductFilters 
        onFiltersChange={setFilters} 
        products={saiasCalcasData}
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
          Saias e Calças Femininas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Nossa coleção de saias e calças oferece peças essenciais para o guarda-roupa feminino. 
          Desde saias elegantes para eventos especiais até calças confortáveis para o dia a dia. 
          Encontre modelagens que valorizam seu corpo e proporcionam conforto em todas as ocasiões.
        </Typography>
      </Box>
    </Container>
  )
}

export default SaiaCalca
