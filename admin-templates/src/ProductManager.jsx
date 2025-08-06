import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  TextField,
  InputAdornment,
  Container,
  Card,
  CardContent,
  Avatar,
  Grid,
  Paper,
  Fade,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material'
import { 
  Logout, 
  Add, 
  Search, 
  Dashboard,
  Inventory,
  Refresh
} from '@mui/icons-material'
import { productService } from './services/productService'
import logger from './utils/logger'

const ProductManager = ({ onLogout, logoutLoading = false }) => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState('checking') // 'online', 'offline', 'checking'

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }, [products, searchTerm])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setApiStatus('checking')
      
      const data = await productService.getProducts()
      setProducts(data || [])
      setFilteredProducts(data || [])
      
      // Se chegou até aqui com dados, a API está funcionando
      setApiStatus('online')
    } catch (error) {
      logger.error('Erro ao carregar produtos:', error)
      setApiStatus('offline')
      
      // Tentar usar dados de demonstração
      try {
        const demoData = productService.getDemoProducts()
        setProducts(demoData)
        setFilteredProducts(demoData)
      } catch (demoError) {
        setProducts([])
        setFilteredProducts([])
      }
    } finally {
      setLoading(false)
    }
  }

  const getStats = () => {
    return {
      total: products.length,
      featured: products.filter(p => p.isFeatured).length
    }
  }

  const stats = getStats()

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 0
        }}
      >
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Painel Administrativo - Produtos
          </Typography>
          
          <Button
            color="inherit"
            onClick={onLogout}
            disabled={logoutLoading}
            startIcon={logoutLoading ? <CircularProgress size={16} color="inherit" /> : <Logout />}
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            {logoutLoading ? 'Saindo...' : 'Sair'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        {/* Status da API */}
        {apiStatus !== 'checking' && (
          <Alert 
            severity={apiStatus === 'online' ? 'success' : 'warning'} 
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              apiStatus === 'offline' && (
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={loadProducts}
                  startIcon={<Refresh />}
                >
                  Tentar Conectar
                </Button>
              )
            }
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={apiStatus === 'online' ? 'ONLINE' : 'OFFLINE'} 
                color={apiStatus === 'online' ? 'success' : 'warning'}
                size="small"
              />
              <Typography variant="body2">
                {apiStatus === 'online' 
                  ? 'Conectado com a API - Dados em tempo real'
                  : 'API indisponível - Usando dados de demonstração'
                }
              </Typography>
            </Box>
          </Alert>
        )}

        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  mx: 'auto', 
                  mb: 1,
                  width: 56, 
                  height: 56 
                }}>
                  <Inventory />
                </Avatar>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de Produtos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Actions */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2, 
            alignItems: { sm: 'center' },
            justifyContent: 'space-between'
          }}>
            <TextField
              placeholder="Buscar produtos por nome, descrição, categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="medium"
              sx={{ 
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                )
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={loadProducts}
                variant="outlined"
                startIcon={<Refresh />}
                sx={{ borderRadius: 2 }}
              >
                Atualizar
              </Button>
              
              <Button
                onClick={() => setShowForm(true)}
                variant="contained"
                startIcon={<Add />}
                sx={{ 
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #E91E63, #9C27B0)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #C2185B, #7B1FA2)',
                  }
                }}
              >
                Novo Produto
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Product List */}
        <Paper elevation={2} sx={{ borderRadius: 3 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Lista de Produtos ({filteredProducts.length})
            </Typography>
            
            {filteredProducts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Inventory sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchTerm ? 'Tente outro termo de busca' : 'Clique em "Novo Produto" para começar'}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card elevation={1} sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" noWrap>
                          {product.name || 'Produto sem nome'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {product.category || 'Sem categoria'}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                          R$ {typeof product.price === 'number' ? product.price.toFixed(2) : (parseFloat(product.price) ? parseFloat(product.price).toFixed(2) : '0.00')}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

ProductManager.propTypes = {
  onLogout: PropTypes.func.isRequired,
  logoutLoading: PropTypes.bool
}


export default ProductManager
