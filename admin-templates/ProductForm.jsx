import React, { useState } from 'react'
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
  Divider
} from '@mui/material'
import { Save, Cancel, CloudUpload } from '@mui/icons-material'

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: product?.nome || '',
    descricao: product?.descricao || '',
    preco: product?.preco || '',
    precoPromocional: product?.precoPromocional || '',
    categoria: product?.categoria || '',
    tamanhos: product?.tamanhos || [],
    imagens: product?.imagens || [],
    tags: product?.tags || [],
    promocoes: product?.promocoes || ''
  })
  
  const [newTag, setNewTag] = useState('')
  const [newTamanho, setNewTamanho] = useState('')
  const [errors, setErrors] = useState({})

  const categorias = ['Roupas', 'Bolsas', 'Sapatos', 'Acessórios', 'Eletrônicos', 'Casa & Decoração', 'Esportes', 'Beleza', 'Livros']
  const tamanhosDisponiveis = ['PP', 'P', 'M', 'G', 'GG', 'XG', '36', '37', '38', '39', '40', '41', '42']

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newImage = e.target.result
        handleChange('imagens', [...formData.imagens, newImage])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (index) => {
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
          {product ? '✏️ Editar Produto' : '➕ Adicionar Novo Produto'}
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
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <MenuItem value="" disabled>
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
                    Escolha a categoria do produto
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

          {/* Tamanhos */}
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
                      src={img}
                      alt={`Produto ${index + 1}`}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'cover',
                        display: 'block'
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
              backgroundColor: 'info.50',
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'info.main',
              textAlign: 'center'
            }}>
              <CloudUpload sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                Adicione imagens do produto
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Aceita múltiplas imagens • JPG, PNG, GIF • Máx: 5MB cada
              </Typography>
              <Button
                component="label"
                variant="contained"
                color="info"
                startIcon={<CloudUpload />}
                size="large"
                sx={{ px: 4 }}
              >
                Selecionar Imagens
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
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
            {product ? '💾 Atualizar Produto' : '✨ Salvar Produto'}
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default ProductForm
