import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  CircularProgress,
  LinearProgress
} from '@mui/material'
import { useState, useEffect } from 'react'
import { Save, Cancel, CloudUpload, Delete } from '@mui/icons-material'
import { API_CONFIG } from './src/services/apiConfig.js'
import { productService } from './src/services/productService.js'

function ProductForm({ produto, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nome: produto?.nome || '',
    descricao: produto?.descricao || '',
    preco: produto?.preco || '',
    precoPromocional: produto?.precoPromocional || '',
    categoria: produto?.categoria || '',
    tamanhos: produto?.tamanhos || [],
    imagens: produto?.imagens || [],
    tags: produto?.tags || [],
    promocoes: produto?.promocoes || ''
  })
  
  const [newTag, setNewTag] = useState('')
  const [newTamanho, setNewTamanho] = useState('')
  const [errors, setErrors] = useState({})
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [categorias, setCategorias] = useState([])
  const [categoriasLoading, setCategoriasLoading] = useState(true)

  const tamanhosDisponiveis = ['PP', 'P', 'M', 'G', 'GG', 'XG', '34', '35', '36', '37', '38', '39', '40', '41', '42']

  // Função para obter o token de autenticação
  const getAuthToken = () => {
    return localStorage.getItem('admin_token')
  }

  // Carregar categorias do banco de dados
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        setCategoriasLoading(true)
        const categoriasDb = await productService.getCategories()
        setCategorias(categoriasDb)
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
        // Em caso de erro, usar categorias padrão
        setCategorias(['Blusas', 'Bolsas', 'Roupas', 'Sapatos'])
      } finally {
        setCategoriasLoading(false)
      }
    }

    loadCategorias()
  }, [])

  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Se a categoria mudou para "Bolsas", definir tamanho único automaticamente
      if (field === 'categoria' && value === 'Bolsas') {
        newData.tamanhos = ['Único']
      }
      
      return newData
    })
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleChange('tags', [...formData.tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const handleAddTamanho = () => {
    if (newTamanho && !formData.tamanhos.includes(newTamanho)) {
      handleChange('tamanhos', [...formData.tamanhos, newTamanho])
      setNewTamanho('')
    }
  }

  const handleRemoveTamanho = (tamanhoToRemove) => {
    handleChange('tamanhos', formData.tamanhos.filter(t => t !== tamanhoToRemove))
  }

  // Upload de imagens para a API
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setUploadingImages(true)
    setUploadProgress(0)

    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('Token de autenticação não encontrado. Faça login novamente.')
      }

      const uploadedImages = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validação básica no frontend
        if (file.size > 5 * 1024 * 1024) { // 5MB
          alert(`Arquivo ${file.name} é muito grande. Máximo: 5MB`)
          continue
        }

        if (!file.type.startsWith('image/')) {
          alert(`Arquivo ${file.name} não é uma imagem válida`)
          continue
        }

        const formDataUpload = new FormData()
        formDataUpload.append('file', file)
        formDataUpload.append('folder', 'products')

        try {
          const response = await fetch(`${API_CONFIG.baseURL}/images/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formDataUpload
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `Erro ao fazer upload de ${file.name}`)
          }

          const result = await response.json()
          uploadedImages.push(result.imageUrl)
          
          // Atualizar progresso
          setUploadProgress(((i + 1) / files.length) * 100)
          
        } catch (error) {
          console.error(`Erro no upload de ${file.name}:`, error)
          alert(`Erro ao fazer upload de ${file.name}: ${error.message}`)
        }
      }

      // Adicionar imagens carregadas com sucesso ao estado
      if (uploadedImages.length > 0) {
        handleChange('imagens', [...formData.imagens, ...uploadedImages])
      }

    } catch (error) {
      console.error('Erro no upload de imagens:', error)
      alert(`Erro no upload: ${error.message}`)
    } finally {
      setUploadingImages(false)
      setUploadProgress(0)
      // Limpar o input
      event.target.value = ''
    }
  }

  // Remover imagem e deletar do servidor se necessário
  const handleRemoveImage = async (index) => {
    const imageUrl = formData.imagens[index]
    
    try {
      // Se a imagem é do servidor (começa com /uploads), tenta deletar
      if (imageUrl.startsWith('/uploads') || imageUrl.includes('/uploads')) {
        const token = getAuthToken()
        if (token) {
          // Extrair apenas o caminho da imagem, removendo qualquer URL base
          const imagePath = imageUrl.replace(/https?:\/\/[^/]+/, '')
          
          await fetch(`${API_CONFIG.baseURL}/images/delete`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imagePath })
          })
        }
      }
    } catch (error) {
      console.warn('Erro ao deletar imagem do servidor:', error)
    }
    
    // Remove da lista local
    const newImages = formData.imagens.filter((_, i) => i !== index)
    handleChange('imagens', newImages)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória'
    if (!formData.preco || formData.preco <= 0) newErrors.preco = 'Preço deve ser maior que zero'
    if (!formData.categoria) newErrors.categoria = 'Categoria é obrigatória'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave({
        ...formData,
        preco: parseFloat(formData.preco),
        precoPromocional: formData.precoPromocional ? parseFloat(formData.precoPromocional) : null
      })
    }
  }

  return (
    <Paper sx={{ 
      p: 4, 
      maxWidth: 900, 
      mx: 'auto',
      borderRadius: 2,
      boxShadow: 3
    }}>
      {/* Cabeçalho */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="primary">
          {produto ? '✏️ Editar Produto' : '➕ Adicionar Novo Produto'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preencha as informações do produto com cuidado
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Seção 1: Informações Básicas */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            📝 Informações Básicas
          </Typography>
          
          <Grid container spacing={3}>
            {/* Nome do Produto */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Produto"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                error={!!errors.nome}
                helperText={errors.nome || "Digite um nome atrativo para o produto"}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            {/* Descrição */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descrição"
                value={formData.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                error={!!errors.descricao}
                helperText={errors.descricao || "Descreva as características e benefícios do produto"}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            {/* Preço Normal */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Preço (R$)"
                value={formData.preco}
                onChange={(e) => handleChange('preco', e.target.value)}
                error={!!errors.preco}
                helperText={errors.preco || "Preço de venda do produto"}
                required
                inputProps={{ min: 0, step: 0.01 }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            {/* Preço Promocional */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Preço Promocional (R$)"
                value={formData.precoPromocional}
                onChange={(e) => handleChange('precoPromocional', e.target.value)}
                helperText="Opcional - Preço com desconto"
                inputProps={{ min: 0, step: 0.01 }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            {/* Categoria - Campo Maior */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.categoria} variant="outlined">
                <InputLabel>Categoria *</InputLabel>
                <Select
                  value={formData.categoria}
                  onChange={(e) => handleChange('categoria', e.target.value)}
                  label="Categoria *"
                  required
                  displayEmpty
                  disabled={categoriasLoading}
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <MenuItem value="" disabled>
                    {categoriasLoading ? 'Carregando categorias...' : 'Selecione uma categoria'}
                  </MenuItem>
                  {categorias.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
                {errors.categoria && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.categoria}
                  </Typography>
                )}
                {!errors.categoria && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.5 }}>
                    {categoriasLoading ? 'Carregando categorias do banco...' : 'Escolha a categoria do produto'}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Seção 2: Detalhes do Produto */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            📏 Detalhes do Produto
          </Typography>

          {/* Tamanhos - Apenas para categorias que não sejam Bolsas */}
          {formData.categoria && formData.categoria !== 'Bolsas' && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                👕 Tamanhos Disponíveis
              </Typography>
              
              {formData.tamanhos.length > 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  mb: 3, 
                  flexWrap: 'wrap',
                  p: 2,
                  backgroundColor: 'grey.50',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}>
                  {formData.tamanhos.map(tamanho => (
                    <Chip
                      key={tamanho}
                      label={tamanho}
                      onDelete={() => handleRemoveTamanho(tamanho)}
                      color="primary"
                      variant="filled"
                      sx={{ fontWeight: 'bold' }}
                    />
                  ))}
                </Box>
              )}

              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                alignItems: 'center',
                p: 2,
                backgroundColor: 'primary.50',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'primary.main'
              }}>
                <FormControl size="medium" sx={{ minWidth: 150 }}>
                  <InputLabel>Selecionar Tamanho</InputLabel>
                  <Select
                    value={newTamanho}
                    onChange={(e) => setNewTamanho(e.target.value)}
                    label="Selecionar Tamanho"
                    sx={{ borderRadius: 2 }}
                  >
                    {tamanhosDisponiveis.filter(tam => !formData.tamanhos.includes(tam)).map(tam => (
                      <MenuItem key={tam} value={tam}>{tam}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button 
                  onClick={handleAddTamanho} 
                  disabled={!newTamanho}
                  variant="contained"
                  size="large"
                  sx={{ px: 3 }}
                >
                  Adicionar
                </Button>
              </Box>
            </Box>
          )}

          {/* Informativo para categoria Bolsas */}
          {formData.categoria === 'Bolsas' && (
            <Box sx={{ mb: 4, p: 2, backgroundColor: 'info.50', borderRadius: 2, border: '1px solid', borderColor: 'info.200' }}>
              <Typography variant="body2" color="info.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                ℹ️ Produtos da categoria "Bolsas" não precisam de especificação de tamanho
              </Typography>
            </Box>
          )}

          {/* Tags */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              🏷️ Tags do Produto
            </Typography>
            
            {formData.tags.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                mb: 3, 
                flexWrap: 'wrap',
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                {formData.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="secondary"
                    variant="filled"
                    sx={{ fontWeight: 'bold' }}
                  />
                ))}
              </Box>
            )}

            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'center',
              p: 2,
              backgroundColor: 'secondary.50',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'secondary.main'
            }}>
              <TextField
                label="Nova tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Ex: verão, elegante, casual..."
                sx={{ 
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <Button 
                onClick={handleAddTag} 
                disabled={!newTag.trim()}
                variant="contained"
                color="secondary"
                size="large"
                sx={{ px: 3 }}
              >
                Adicionar
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Seção 3: Promoções e Imagens */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            🎯 Marketing e Imagens
          </Typography>

          {/* Promoções */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              label="💰 Promoções/Desconto"
              value={formData.promocoes}
              onChange={(e) => handleChange('promocoes', e.target.value)}
              placeholder="Ex: 20% OFF, Promoção de Verão, Frete Grátis..."
              helperText="Opcional - Digite ofertas especiais ou descontos"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>

          {/* Upload de Imagens */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              📸 Imagens do Produto
            </Typography>

            {/* Progresso do upload */}
            {uploadingImages && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Enviando imagens... {Math.round(uploadProgress)}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
            )}
            
            {formData.imagens.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                mb: 3, 
                flexWrap: 'wrap',
                p: 3,
                backgroundColor: 'grey.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                {formData.imagens.map((img, index) => (
                  <Box key={index} sx={{ 
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 2
                  }}>
                    <img
                      src={img.startsWith('http') ? img : `http://localhost:5006${img}`}
                      alt={`Produto ${index + 1}`}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'contain',
                        display: 'block',
                        backgroundColor: '#f9f9f9'
                      }}
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        minWidth: 30,
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,1)',
                        }
                      }}
                    >
                      ×
                    </Button>
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{
              p: 3,
              backgroundColor: uploadingImages ? 'grey.100' : 'info.50',
              borderRadius: 2,
              border: '2px dashed',
              borderColor: uploadingImages ? 'grey.400' : 'info.main',
              textAlign: 'center'
            }}>
              <CloudUpload sx={{ 
                fontSize: 48, 
                color: uploadingImages ? 'grey.400' : 'info.main', 
                mb: 2 
              }} />
              <Typography variant="body1" gutterBottom>
                {uploadingImages ? 'Enviando imagens...' : 'Adicione imagens do produto'}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Aceita múltiplas imagens • JPG, PNG, GIF, WEBP • Máx: 5MB cada
              </Typography>
              <Button
                component="label"
                variant="contained"
                color="info"
                startIcon={uploadingImages ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                size="large"
                sx={{ px: 4 }}
                disabled={uploadingImages}
              >
                {uploadingImages ? 'Enviando...' : 'Selecionar Imagens'}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                />
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Botões de Ação */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          justifyContent: 'center',
          pt: 2,
          pb: 1
        }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            startIcon={<Cancel />}
            size="large"
            disabled={uploadingImages}
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: 3,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              }
            }}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            size="large"
            disabled={uploadingImages}
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(45deg, #E91E63 30%, #F06292 90%)',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s'
            }}
          >
            {produto ? '💾 Atualizar Produto' : '✨ Salvar Produto'}
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default ProductForm
