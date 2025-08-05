import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  InputAdornment,
  Container,
  Card,
  CardContent,
  Chip,
  Avatar,
  Grid,
  Paper,
  Badge,
  Fade,
  Zoom
} from '@mui/material'
import { 
  Logout, 
  Add, 
  Search, 
  Clear, 
  Dashboard,
  Inventory,
  FilterList,
  Refresh
} from '@mui/icons-material'
import ProductForm from './ProductForm'
import ProductList from './ProductList'

const ProductManager = ({ onLogout }) => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Carregar produtos do localStorage
    const savedProducts = localStorage.getItem('admin_products')
    if (savedProducts) {
      const loadedProducts = JSON.parse(savedProducts)
      setProducts(loadedProducts)
      setFilteredProducts(loadedProducts)
    }
  }, [])

  // Filtrar produtos quando searchTerm ou products mudarem
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product =>
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredProducts(filtered)
    }
  }, [products, searchTerm])

  const saveProducts = (newProducts) => {
    setProducts(newProducts)
    localStorage.setItem('admin_products', JSON.stringify(newProducts))
  }

  const handleAddProduct = (productData) => {
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const newProducts = [...products, newProduct]
    saveProducts(newProducts)
    setShowForm(false)
  }

  const handleEditProduct = (productData) => {
    const updatedProducts = products.map(product =>
      product.id === editingProduct.id
        ? { ...productData, id: editingProduct.id, updatedAt: new Date().toISOString() }
        : product
    )
    saveProducts(updatedProducts)
    setEditingProduct(null)
    setShowForm(false)
  }

  const handleDeleteProduct = (productId) => {
    const newProducts = products.filter(product => product.id !== productId)
    saveProducts(newProducts)
  }

  const openEditForm = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const refreshProducts = () => {
    const savedProducts = localStorage.getItem('admin_products')
    if (savedProducts) {
      const loadedProducts = JSON.parse(savedProducts)
      setProducts(loadedProducts)
      setFilteredProducts(loadedProducts)
    }
  }

  const getStats = () => {
    const total = products.length
    return { total }
  }

  const stats = getStats()

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
            startIcon={<Logout />}
            sx={{ 
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
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
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={clearSearch} size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                onClick={refreshProducts}
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

          {searchTerm && (
            <Box sx={{ mt: 2 }}>
              <Chip
                label={`${filteredProducts.length} produto(s) encontrado(s) para "${searchTerm}"`}
                color="primary"
                variant="outlined"
                onDelete={clearSearch}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          )}
        </Paper>

        {/* Product Form Modal */}
        {showForm && (
          <Fade in={showForm}>
            <Box>
              <ProductForm
                product={editingProduct}
                onSave={editingProduct ? handleEditProduct : handleAddProduct}
                onCancel={() => {
                  setShowForm(false)
                  setEditingProduct(null)
                }}
              />
            </Box>
          </Fade>
        )}

        {/* Product List */}
        {!showForm && (
          <Zoom in={!showForm}>
            <Box>
              <ProductList
                products={filteredProducts}
                onEdit={openEditForm}
                onDelete={handleDeleteProduct}
              />
            </Box>
          </Zoom>
        )}
      </Container>
    </Box>
  )
}

export default ProductManager
