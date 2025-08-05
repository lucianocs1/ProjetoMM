import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Card, 
  CardContent,
  CardMedia,
  Chip
} from '@mui/material'
import { LocalMall, TrendingUp, Favorite, Support } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/ProductCard/ProductCard'
import Carousel from '../../components/Carousel/Carousel'
import { featuredProducts } from '../../data/products'

const Home = () => {
  const categories = [
    {
      name: 'Roupas',
      path: '/roupas',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&crop=center',
      description: 'Encontre roupas para todos os estilos'
    },
    {
      name: 'Bolsas',
      path: '/bolsas',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&crop=center',
      description: 'Acessórios essenciais para seu look'
    },
    {
      name: 'Sapatos',
      path: '/sapatos',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&crop=center',
      description: 'Calçados que combinam com você'
    }
  ]

  return (
    <Box>
      {/* Carousel Hero Section */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Carousel />
      </Container>

      {/* Hero Text Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #e91e63 0%, #f8bbd9 100%)',
          color: 'white',
          py: 6,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            <Box component="span" sx={{ color: 'white' }}>MENINA</Box>
            <Box component="span" sx={{ color: 'rgba(255, 255, 255, 0.9)', ml: 2 }}>MULHER</Box>
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            Moda feminina com estilo e personalidade
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, fontSize: '1.2rem' }}>
            Descubra as últimas tendências em moda feminina. Qualidade, estilo e preços especiais.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ 
              backgroundColor: 'white', 
              color: 'primary.main',
              px: 4,
              py: 1.5,
              '&:hover': { backgroundColor: 'grey.100' }
            }}
            startIcon={<LocalMall />}
          >
            Ver Coleção
          </Button>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          Nossas Categorias
        </Typography>
        
        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.name} sx={{ maxWidth: { md: '320px' } }}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-8px)' },
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={category.image}
                  alt={category.name}
                />
                <CardContent sx={{ textAlign: 'center', p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                    {category.description}
                  </Typography>
                  <Button
                    component={Link}
                    to={category.path}
                    variant="contained"
                    fullWidth
                    sx={{ mt: 'auto' }}
                  >
                    Ver Produtos
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Produtos em Destaque
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Confira nossas peças mais populares
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section - 4 boxes aligned */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6 }}>
          Por Que Escolher a MENINA MULHER?
        </Typography>
        
        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
              <TrendingUp sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                Últimas Tendências
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Sempre atualizadas com as últimas tendências da moda
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
              <Favorite sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                Qualidade Premium
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Produtos selecionados com materiais de alta qualidade
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
              <Support sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                Atendimento Personalizado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Suporte dedicado via WhatsApp e Instagram
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
              <LocalMall sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                Entrega Rápida
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Enviamos para todo o Brasil com rapidez e segurança
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Home
