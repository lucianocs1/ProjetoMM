import React, { useState, useEffect } from 'react'
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
  LinearProgress,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { Save, Cancel, CloudUpload, Delete } from '@mui/icons-material'

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: product?.nome || '',
    descricao: product?.descricao || '',
    preco: product?.preco?.toString() || '',
    precoPromocional: product?.precoPromocional?.toString() || '',
    categoria: product?.categoria || '',
    categoriaId: product?.categoriaId || '',
    tamanhos: product?.tamanhos || [],
    imagens: product?.imagens || [],
    tags: product?.tags || [],
    promocoes: product?.promocoes || '',
    isFeatured: product?.isFeatured || false
  })
  
  const [newTamanho, setNewTamanho] = useState('')
  const [errors, setErrors] = useState({})
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const categorias = ['Roupas', 'Blusas', 'Bolsas', 'Sapatos', 'Saias e Calças']
  
  // Tamanhos disponíveis baseados na categoria
  const getTamanhosDisponiveis = () => {
    if (formData.categoria === 'Sapatos') {
      return ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44']
    }
    if (formData.categoria === 'Saias e Calças') {
      return ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', 'PP', 'P', 'M', 'G', 'GG', 'XG']
    }
    return ['PP', 'P', 'M', 'G', 'GG', 'XG']
  }

  // Função para verificar se a categoria requer tamanhos
  const categoriaPrecisaTamanhos = () => {
    return formData.categoria && formData.categoria !== 'Bolsas';
  }
  
  const tamanhosDisponiveis = getTamanhosDisponiveis()

  // Atualizar formulário quando produto mudar
  useEffect(() => {
    console.log('🔍 Produto recebido para edição:', product)
    if (product) {
      const newFormData = {
        nome: product?.nome || '',
        descricao: product?.descricao || '',
        preco: product?.preco?.toString() || '',
        precoPromocional: product?.precoPromocional?.toString() || '',
        categoria: product?.categoria || '',
        categoriaId: product?.categoriaId || '',
        tamanhos: product?.tamanhos || [],
        imagens: product?.imagens || [],
        tags: product?.tags || [],
        promocoes: product?.promocoes || '',
        isFeatured: product?.isFeatured || false
      }
      console.log('📝 Dados do formulário mapeados:', newFormData)
      setFormData(newFormData)
    }
  }, [product])

  // Limpar tamanhos selecionados quando categoria mudar
  useEffect(() => {
    if (formData.categoria) {
      // Se for categoria Bolsas, limpar todos os tamanhos
      if (formData.categoria === 'Bolsas') {
        if (formData.tamanhos.length > 0) {
          setFormData(prev => ({
            ...prev,
            tamanhos: []
          }))
        }
      } else {
        // Para outras categorias, manter apenas tamanhos válidos
        const tamanhosAtuais = getTamanhosDisponiveis()
        const tamanhosValidos = formData.tamanhos.filter(tamanho => 
          tamanhosAtuais.includes(tamanho)
        )
        
        if (tamanhosValidos.length !== formData.tamanhos.length) {
          setFormData(prev => ({
            ...prev,
            tamanhos: tamanhosValidos
          }))
        }
      }
    }
  }, [formData.categoria])

  const API_BASE_URL = 'http://localhost:5006/api'

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Limpar erro do campo quando usuário digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const addTamanho = () => {
    if (newTamanho.trim() && !formData.tamanhos.includes(newTamanho.trim())) {
      handleChange('tamanhos', [...formData.tamanhos, newTamanho.trim()])
      setNewTamanho('')
    }
  }

  const removeTamanho = (tamanhoToRemove) => {
    handleChange('tamanhos', formData.tamanhos.filter(t => t !== tamanhoToRemove))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Pegar apenas o primeiro arquivo
    const file = files[0]
    
    setUploadingImages(true)
    setUploadProgress(0)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)  // Mudança: 'image' -> 'file' para corresponder ao backend

      // Obter token de autorização do localStorage
      const token = localStorage.getItem('admin_token')
      const headers = {}
      
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        headers: headers,
        body: formDataUpload,
      })

      if (response.ok) {
        const result = await response.json()
        // Substituir a imagem existente
        handleChange('imagens', [result.imageUrl])
      } else {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      setUploadProgress(100)
      
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem. Verifique se você está logado.')
    } finally {
      setUploadingImages(false)
      setUploadProgress(0)
    }
  }

  const handleRemoveImage = (indexToRemove) => {
    handleChange('imagens', formData.imagens.filter((_, index) => index !== indexToRemove))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória'
    if (!formData.preco || parseFloat(formData.preco) <= 0) newErrors.preco = 'Preço deve ser maior que zero'
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
        {/* Seção 1: Informações do Produto */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            📝 Informações do Produto
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
                label="Descrição do Produto"
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

            {/* Preços - Atual e Original */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Preço (R$)"
                value={formData.preco}
                onChange={(e) => handleChange('preco', e.target.value)}
                error={!!errors.preco}
                helperText={errors.preco || "Preço atual do produto"}
                required
                variant="outlined"
                inputProps={{ min: 0, step: 0.01 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Preço Original (R$)"
                value={formData.precoPromocional}
                onChange={(e) => handleChange('precoPromocional', e.target.value)}
                helperText="Preço de venda do produto"
                variant="outlined"
                inputProps={{ min: 0, step: 0.01 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            {/* Opções do Produto */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                  ⭐ Opções do Produto
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontStyle: 'italic' }}>
                  💡 Produtos são automaticamente marcados como "Novos" por 60 dias após a criação
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.isFeatured}
                          onChange={(e) => handleChange('isFeatured', e.target.checked)}
                          color="primary"
                        />
                      }
                      label="⭐ Produto em Destaque"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Informações de Promoção */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Detalhes da Promoção"
                value={formData.promocoes}
                onChange={(e) => handleChange('promocoes', e.target.value)}
                helperText="Descreva ofertas especiais, descontos ou condições promocionais"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Seção 2: Categoria */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            📂 Categoria
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.categoria} required>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={formData.categoria}
                  label="Categoria"
                  onChange={(e) => handleChange('categoria', e.target.value)}
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria} value={categoria}>
                      {categoria}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoria && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, ml: 1 }}>
                    {errors.categoria}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Seção 3: Tamanhos Disponíveis */}
        {categoriaPrecisaTamanhos() ? (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
              📏 Tamanhos Disponíveis
            </Typography>
            
            {formData.categoria && (
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontStyle: 'italic' }}>
                {formData.categoria === 'Sapatos' 
                  ? '👟 Numeração de calçados (34-44)' 
                  : formData.categoria === 'Saias e Calças'
                  ? '👖 Numeração + Tamanhos de roupas (34-44 e PP-XG)'
                  : '👕 Tamanhos de roupas (PP-XG)'}
              </Typography>
            )}
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Adicionar Tamanho</InputLabel>
                <Select
                  value={newTamanho}
                  label="Adicionar Tamanho"
                  onChange={(e) => setNewTamanho(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  {tamanhosDisponiveis.map((tamanho) => (
                    <MenuItem key={tamanho} value={tamanho}>
                      {tamanho}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="primary"
                onClick={addTamanho}
                disabled={!newTamanho}
                sx={{ 
                  height: '56px',
                  borderRadius: 2,
                  px: 3
                }}
              >
                Adicionar Tamanho
              </Button>
            </Grid>

            {/* Tamanhos selecionados */}
            {formData.tamanhos.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Tamanhos selecionados:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tamanhos.map((tamanho, index) => (
                    <Chip
                      key={index}
                      label={tamanho}
                      onDelete={() => removeTamanho(tamanho)}
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
        ) : (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary', fontWeight: 'bold' }}>
              📏 Tamanhos Disponíveis
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              👜 Bolsas possuem tamanho único - esta seção não é necessária
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Seção 4: Imagem do Produto */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            🖼️ Imagem do Produto
          </Typography>

          {/* Progress bar durante upload */}
          {uploadingImages && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Enviando imagens... {Math.round(uploadProgress)}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}

          {/* Imagem carregada */}
          {formData.imagens.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Imagem do produto:
              </Typography>
              <Box sx={{ maxWidth: 300 }}>
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={formData.imagens[0].startsWith('http') ? formData.imagens[0] : `http://localhost:5006${formData.imagens[0]}`}
                    alt="Produto"
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      backgroundColor: '#f9f9f9'
                    }}
                  />
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleRemoveImage(0)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      minWidth: '30px',
                      width: '30px',
                      height: '30px',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,1)',
                      }
                    }}
                  >
                    <Delete fontSize="small" />
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

          {/* Área de upload */}
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
              {uploadingImages ? 'Enviando imagem...' : 'Adicione uma imagem do produto'}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
              Uma imagem apenas • JPG, PNG, GIF, WEBP • Máx: 5MB
            </Typography>
            <Button
              component="label"
              variant="contained"
              color="info"
              startIcon={uploadingImages ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
              size="large"
              sx={{ px: 4 }}
              disabled={uploadingImages || formData.imagens.length > 0}
            >
              {uploadingImages ? 'Enviando...' : formData.imagens.length > 0 ? 'Imagem Adicionada' : 'Selecionar Imagem'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
                disabled={uploadingImages || formData.imagens.length > 0}
              />
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Botões de Ação */}
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          justifyContent: 'center',
          pt: 2
        }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Save />}
            disabled={uploadingImages}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: 2,
              minWidth: 150
            }}
          >
            {product ? 'Atualizar' : 'Salvar'} Produto
          </Button>
          
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            size="large"
            startIcon={<Cancel />}
            onClick={onCancel}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: 2,
              minWidth: 150
            }}
          >
            Cancelar
          </Button>
        </Box>
      </form>
    </Paper>
  )
}

export default ProductForm
