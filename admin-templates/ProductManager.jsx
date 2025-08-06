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
  Zoom,
  CircularProgress
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
import ProductForm from './ProductFormUpdated'
import ProductList from './ProductList'
import { productService } from './src/services/productService.js'
import { API_CONFIG } from './src/services/apiConfig.js'

const ProductManager = ({ onLogout, logoutLoading }) => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Carregar produtos da API primeiro, fallback para localStorage
    const loadProducts = async () => {
      console.log('=== INICIANDO CARREGAMENTO DE PRODUTOS ===')
      console.log('URL da API:', 'http://localhost:5006/api/products')
      
      try {
        const apiProducts = await loadProductsFromAPI()
        console.log('Produtos carregados da API:', apiProducts.length)
        
        if (apiProducts.length === 0) {
          console.warn('API retornou 0 produtos, tentando localStorage...')
          // Fallback: carregar do localStorage
          const savedProducts = localStorage.getItem('admin_products')
          if (savedProducts) {
            const loadedProducts = JSON.parse(savedProducts)
            setProducts(loadedProducts)
            setFilteredProducts(loadedProducts)
            console.log('Produtos carregados do localStorage:', loadedProducts.length)
          }
        }
      } catch (error) {
        console.error('ERRO ao carregar da API:', error)
        // Fallback: carregar do localStorage
        const savedProducts = localStorage.getItem('admin_products')
        if (savedProducts) {
          const loadedProducts = JSON.parse(savedProducts)
          setProducts(loadedProducts)
          setFilteredProducts(loadedProducts)
          console.log('Produtos carregados do localStorage (fallback):', loadedProducts.length)
        }
      }
    }
    
    loadProducts()
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

  // Função para carregar produtos da API
  const loadProductsFromAPI = async () => {
    try {
      console.log('🔍 Carregando produtos da API...')
      
      const apiProducts = await productService.getProducts()
      console.log('📦 Produtos carregados:', apiProducts.length)
      
      if (apiProducts && apiProducts.value) {
        // Converter produtos da API para formato do admin
        const convertedProducts = apiProducts.value.map(product => {
          const converted = {
            id: product.id?.toString() || Date.now().toString(),
            nome: product.name || product.nome || 'Produto sem nome',
            descricao: product.description || product.descricao || 'Sem descrição',
            preco: parseFloat(product.price || product.preco || 0),
            precoPromocional: product.originalPrice || product.precoPromocional || null,
            categoria: product.category || product.categoria || 'Sem categoria',
            categoriaId: product.categoryId || null,
            tamanhos: product.sizes || product.tamanhos || [],
            imagens: product.image ? [product.image] : (product.imagens || []),
            tags: product.tags || [],
            promocoes: (product.originalPrice || product.precoPromocional) ? 'Promoção' : (product.promocoes || ''),
            isNew: Boolean(product.isNew),
            isFeatured: Boolean(product.isFeatured),
            createdAt: product.createdAt || new Date().toISOString(),
            updatedAt: product.updatedAt || new Date().toISOString()
          }
          
          return converted
        })
        
        setProducts(convertedProducts)
        setFilteredProducts(convertedProducts)
        
        // Sincronizar com localStorage
        localStorage.setItem('admin_products', JSON.stringify(convertedProducts))
        
        console.log('✅ Produtos recarregados da API:', convertedProducts.length)
        console.log('📋 Lista de produtos:', convertedProducts)
        return convertedProducts
      } else if (apiProducts && Array.isArray(apiProducts)) {
        // Caso a API retorne diretamente um array - CONVERTER TAMBÉM
        console.log('📦 API retornou array direto:', apiProducts.length)
        
        // Converter produtos da API para formato do admin
        const convertedProducts = apiProducts.map(product => {
          const converted = {
            id: product.id?.toString() || Date.now().toString(),
            nome: product.name || product.nome || 'Produto sem nome',
            descricao: product.description || product.descricao || 'Sem descrição',
            preco: parseFloat(product.price || product.preco || 0),
            precoPromocional: product.originalPrice || product.precoPromocional || null,
            categoria: product.category || product.categoria || 'Sem categoria',
            categoriaId: product.categoryId || null,
            tamanhos: product.sizes || product.tamanhos || [],
            imagens: product.image ? [product.image] : (product.imagens || []),
            tags: product.tags || [],
            promocoes: (product.originalPrice || product.precoPromocional) ? 'Promoção' : (product.promocoes || ''),
            isNew: Boolean(product.isNew),
            isFeatured: Boolean(product.isFeatured),
            createdAt: product.createdAt || new Date().toISOString(),
            updatedAt: product.updatedAt || new Date().toISOString()
          }
          
          return converted
        })
        
        setProducts(convertedProducts)
        setFilteredProducts(convertedProducts)
        localStorage.setItem('admin_products', JSON.stringify(convertedProducts))
        console.log('✅ Produtos convertidos do array:', convertedProducts.length)
        console.log('📋 Lista de produtos convertidos:', convertedProducts)
        return convertedProducts
      } else {
        console.warn('⚠️ API retornou formato inesperado:', apiProducts)
        return []
      }
    } catch (error) {
      console.error('❌ Erro ao recarregar produtos da API:', error)
      console.error('📄 Detalhes do erro:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      
      // Em caso de erro, manter produtos atuais
      alert('❌ Erro ao conectar com a API: ' + error.message + '\n\n🔧 Verifique se o backend está rodando em http://localhost:5006')
      return []
    }
  }

  const handleAddProduct = async (productData) => {
    try {
      // Função para normalizar texto (remover acentos)
      const normalizeText = (text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      }

      // Preparar dados para a API
      const apiProductData = {
        name: normalizeText(productData.nome),
        description: normalizeText(productData.descricao),
        price: parseFloat(productData.preco),
        originalPrice: productData.precoPromocional ? parseFloat(productData.precoPromocional) : null,
        categoryId: getCategoryId(productData.categoria),
        sizes: productData.tamanhos.map(size => normalizeText(size)),
        image: productData.imagens?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop&crop=center',
        isFeatured: Boolean(productData.isFeatured) // Incluir campo isFeatured do formulário
      }

      console.log('Enviando produto para API:', apiProductData)
      console.log('isFeatured enviado:', productData.isFeatured, '->', Boolean(productData.isFeatured))

      // Salvar na API
      const savedProduct = await productService.createProduct(apiProductData)
      
      console.log('Produto salvo com sucesso na API:', savedProduct)
      
      // Recarregar produtos da API após criar
      await loadProductsFromAPI()
      
      setShowForm(false)
      
      alert('Produto criado com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar produto na API:', error)
      console.error('Detalhes do erro:', error.message)
      
      // Fallback: salvar apenas no localStorage
      const newProduct = {
        id: Date.now().toString(),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const newProducts = [...products, newProduct]
      saveProducts(newProducts)
      setShowForm(false)
      
      alert('Erro ao salvar na API, produto salvo apenas localmente: ' + error.message)
    }
  }

  // Função auxiliar para obter ID da categoria
  const getCategoryId = (categoryName) => {
    const categoryMap = {
      'Roupas': 1,
      'Blusas': 2, 
      'Bolsas': 3,
      'Sapatos': 4,
      'Saias e Calças': 5
    }
    return categoryMap[categoryName] || 1
  }

  const handleEditProduct = async (productData) => {
    try {
      console.log('🔄 Atualizando produto:', productData)
      
      // Preparar dados para API - usar nomes corretos dos campos
      const updateData = {
        name: productData.nome || productData.name,
        description: productData.descricao || productData.description,
        price: parseFloat(productData.preco || productData.price),
        originalPrice: productData.precoOriginal ? parseFloat(productData.precoOriginal) : null,
        categoryId: parseInt(productData.categoriaId || productData.categoryId),
        sizes: productData.tamanhos || productData.sizes || [],
        isNew: productData.isNew || false,
        isFeatured: productData.isFeatured || false,
        isActive: true,
        image: productData.imagens && productData.imagens.length > 0 ? productData.imagens[0] : null
      }
      
      console.log('📤 Dados para API:', updateData)
      
      // Obter token de autenticação (temporariamente opcional)
      const token = localStorage.getItem('admin_token')
      const headers = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${API_CONFIG.baseURL}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updateData)
      })
      
      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', response.headers)
      
      if (response.ok) {
        let result = null
        // Status 204 (No Content) não tem corpo JSON
        if (response.status !== 204) {
          try {
            result = await response.json()
          } catch (e) {
            console.log('ℹ️ Resposta sem JSON (normal para 204)')
          }
        }
        
        console.log('✅ Produto atualizado com sucesso!', result)
        await loadProductsFromAPI() // Recarregar lista da API
        setEditingProduct(null)
        setShowForm(false)
        alert('Produto atualizado com sucesso!')
      } else {
        const errorText = await response.text()
        console.error('❌ Erro ao atualizar produto:', response.status, errorText)
        alert(`Erro ao atualizar produto: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar produto:', error)
      alert('Erro ao atualizar produto: ' + error.message)
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      // Confirmar exclusão
      if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return
      }

      console.log('🗑️ Excluindo produto:', productId)

      // Excluir da API primeiro
      await productService.deleteProduct(productId)
      console.log('✅ Produto excluído da API com sucesso')

      // Recarregar lista da API
      await loadProductsFromAPI()
      
      alert('Produto excluído com sucesso!')
    } catch (error) {
      console.error('❌ Erro ao excluir produto da API:', error)
      
      // Fallback: excluir apenas do localStorage
      const newProducts = products.filter(product => product.id !== productId)
      saveProducts(newProducts)
      
      alert('Erro ao excluir da API, removido apenas localmente: ' + error.message)
    }
  }

  const openEditForm = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const refreshProducts = async () => {
    console.log('Atualizando lista de produtos...')
    await loadProductsFromAPI()
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
