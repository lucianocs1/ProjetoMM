import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip,
  IconButton
} from '@mui/material'
import { WhatsApp, Instagram, Favorite, FavoriteBorder } from '@mui/icons-material'
import { useState } from 'react'

// Função helper para formatar moeda
const formatCurrency = (value) => {
  if (typeof value === 'string') {
    return `R$ ${value}`
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  
  const whatsappNumber = '5532984033503' // Número atualizado da MENINA MULHER
  const instagramHandle = '@meninamulher201' // Instagram oficial da loja

  // Função para determinar o melhor objectFit baseado na categoria ou nome do produto
  const getImageFit = () => {
    const productName = product.name?.toLowerCase() || ''
    const category = product.category?.toLowerCase() || ''
    
    // Para vestidos e roupas longas, usar contain para mostrar a peça completa
    if (productName.includes('vestido') || 
        productName.includes('dress') || 
        category.includes('vestido') ||
        category.includes('dress')) {
      return 'contain'
    }
    
    // Para bolsas e sapatos, cover funciona melhor
    if (category.includes('bolsa') || 
        category.includes('sapato') || 
        category.includes('bag') || 
        category.includes('shoe')) {
      return 'cover'
    }
    
    // Padrão: contain para preservar a proporção
    return 'contain'
  }

  const handleWhatsAppClick = () => {
    const price = typeof product.price === 'number' ? formatCurrency(product.price) : `R$ ${product.price}`
    const message = `Olá! Tenho interesse no produto: ${product.name} - ${price}`
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/meninamulher201/', '_blank')
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {product.image && product.image.trim() !== '' ? (
          <CardMedia
            component="img"
            height="160"
            image={product.image}
            alt={product.name}
            sx={{ 
              objectFit: getImageFit(),
              objectPosition: 'center',
              backgroundColor: 'grey.50',
              width: '100%',
              borderRadius: '4px 4px 0 0',
              padding: getImageFit() === 'contain' ? '8px' : '0px'
            }}
          />
        ) : (
          <Box sx={{
            height: 160,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.100',
            color: 'grey.400',
            fontSize: 20,
            borderRadius: '4px 4px 0 0'
          }}>
            Sem imagem
          </Box>
        )}
        <IconButton
          onClick={toggleFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
          }}
        >
          {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        
        {(product.isNew || product.featured || product.originalPrice) && (
          <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {product.isNew && (
              <Chip
                label="Novo"
                color="primary"
                size="small"
              />
            )}
            {product.featured && (
              <Chip
                label="Destaque"
                color="secondary"
                size="small"
              />
            )}
            {product.originalPrice && (
              <Chip
                label="Promoção"
                color="error"
                size="small"
                sx={{ 
                  backgroundColor: '#ff4444',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            )}
          </Box>
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '0.95rem', mb: 0.5 }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, flexGrow: 1, fontSize: '0.8rem' }}>
          {product.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            {typeof product.price === 'number' ? formatCurrency(product.price) : `R$ ${product.price}`}
          </Typography>
          {product.originalPrice && (
            <>
              <Typography 
                variant="body2" 
                sx={{ 
                  ml: 1, 
                  textDecoration: 'line-through',
                  color: 'text.secondary'
                }}
              >
                {typeof product.originalPrice === 'number' ? formatCurrency(product.originalPrice) : `R$ ${product.originalPrice}`}
              </Typography>
              <Chip
                label={`-${Math.round((1 - (parseFloat(product.price) / parseFloat(product.originalPrice))) * 100)}%`}
                color="error"
                size="small"
                sx={{ 
                  ml: 1,
                  backgroundColor: '#ff4444',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              />
            </>
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
          Tamanhos disponíveis: {product.sizes?.join(', ')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<WhatsApp />}
            onClick={handleWhatsAppClick}
            sx={{ flex: 1, fontSize: '0.7rem', py: 0.25, px: 1 }}
            size="small"
          >
            WhatsApp
          </Button>
          <Button
            variant="outlined"
            startIcon={<Instagram />}
            onClick={handleInstagramClick}
            sx={{ flex: 1, fontSize: '0.7rem', py: 0.25, px: 1 }}
            size="small"
          >
            Instagram
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductCard
