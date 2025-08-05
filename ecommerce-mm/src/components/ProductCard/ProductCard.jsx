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
  
  const whatsappNumber = '5511999999999' // Substitua pelo número real
  const instagramHandle = '@modafem' // Substitua pelo handle real

  const handleWhatsAppClick = () => {
    const price = typeof product.price === 'number' ? formatCurrency(product.price) : `R$ ${product.price}`
    const message = `Olá! Tenho interesse no produto: ${product.name} - ${price}`
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleInstagramClick = () => {
    window.open(`https://instagram.com/${instagramHandle.replace('@', '')}`, '_blank')
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
        <CardMedia
          component="img"
          height="250"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
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
        
        {(product.isNew || product.featured) && (
          <Chip
            label={product.isNew ? "Novo" : "Destaque"}
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
            }}
          />
        )}
      </Box>
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1.1rem' }}>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
            {typeof product.price === 'number' ? formatCurrency(product.price) : `R$ ${product.price}`}
          </Typography>
          {product.originalPrice && (
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
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Tamanhos disponíveis: {product.sizes?.join(', ')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<WhatsApp />}
            onClick={handleWhatsAppClick}
            sx={{ flex: 1 }}
          >
            WhatsApp
          </Button>
          <Button
            variant="outlined"
            startIcon={<Instagram />}
            onClick={handleInstagramClick}
            sx={{ flex: 1 }}
          >
            Instagram
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductCard
