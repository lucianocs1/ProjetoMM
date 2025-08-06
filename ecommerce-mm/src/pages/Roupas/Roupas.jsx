import { useState, useMemo } from 'react'
import { Container, Typography, Grid, Box, Chip, CircularProgress, Alert } from '@mui/material'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductFilters from '../../components/ProductFilters/ProductFilters'
import { useMultiCategoryProducts } from '../../hooks/useMultiCategoryProducts'

const Roupas = () => {
  // Buscar produtos das categorias: Roupas, Blusas e Saias e Calças
  const { products, loading, error } = useMultiCategoryProducts(['roupas', 'blusas', 'saia-calca'])
  
  const [filters, setFilters] = useState({
    search: '',
    priceRange: [0, 2000],
    sizes: [],
    sortBy: 'name',
    isNew: false,
  })

  // Combinar e filtrar produtos
  const allProducts = useMemo(() => {
    return products
  }, [products])

  // Removido bloco condicional de hooks, tudo tratado no JSX abaixo

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts]

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
  }, [allProducts, filters])

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Roupas
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Roupas, Blusas, Saias e Calças - Encontre a peça perfeita para cada ocasião
        </Typography>
      </Box>

      {/* Filtros */}
      <ProductFilters 
        filters={filters}
        onFiltersChange={setFilters} 
        availableSizes={['PP', 'P', 'M', 'G', 'GG', 'XG', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44']}
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
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Carregando produtos...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
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
