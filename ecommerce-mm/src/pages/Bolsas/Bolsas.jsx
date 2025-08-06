import { useState, useMemo } from 'react'
import { Container, Typography, Grid, Box, Chip, CircularProgress, Alert } from '@mui/material'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductFilters from '../../components/ProductFilters/ProductFilters'
import { useProducts } from '../../hooks/useProducts'

const Bolsas = () => {
  const { products, loading, error } = useProducts('bolsas')  // Passa categoria como parâmetro
  
  const [filters, setFilters] = useState({
    search: '',
    priceRange: [0, 2000], // Aumentado para incluir todos os produtos
    sizes: [],
    sortBy: 'name',
    isNew: false,
  })

  // Padronizar lógica igual a Roupas.jsx
  // Removido: já filtrado acima

  const filteredProducts = useMemo(() => {
    let filtered = [...products]  // Usar products já filtrados por categoria

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

    // Filtro de tamanhos: só filtra se houver tamanhos selecionados
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        Array.isArray(product.sizes)
          ? product.sizes.some(size => filters.sizes.includes(size))
          : false
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
          Bolsas
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Acessórios essenciais para completar seu look
        </Typography>
      </Box>

      {/* Filtros */}
      <ProductFilters 
        filters={filters}
        onFiltersChange={setFilters} 
        availableSizes={['Único']}
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
          Nossa Coleção de Bolsas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Descubra nossa linha completa de bolsas femininas, pensada para mulheres que valorizam 
          estilo e praticidade. De bolsas grandes para o trabalho a clutches elegantes para a noite. 
          Todas as nossas bolsas são cuidadosamente selecionadas para garantir qualidade e durabilidade.
        </Typography>
      </Box>
    </Container>
  )
}

export default Bolsas
