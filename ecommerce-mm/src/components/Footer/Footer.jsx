import { Box, Typography, IconButton, Container, Grid } from '@mui/material'
import { Instagram, WhatsApp } from '@mui/icons-material'

const Footer = () => {
  const whatsappNumber = '5511999999999' // Substitua pelo número real
  const instagramHandle = '@meninmulher' // Substitua pelo handle real

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Olá! Tenho interesse em seus produtos.`, '_blank')
  }

  const handleInstagramClick = () => {
    window.open(`https://instagram.com/${instagramHandle.replace('@', '')}`, '_blank')
  }

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                <Box component="span" sx={{ color: 'white' }}>
                  MENINA
                </Box>
                <Box component="span" sx={{ color: 'rgba(255, 255, 255, 0.8)', ml: 1 }}>
                  MULHER
                </Box>
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                Moda feminina com estilo e qualidade. Entre em contato conosco através das nossas redes sociais!
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              flexDirection: 'column',
              gap: 2 
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Fale Conosco
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton
                  onClick={handleWhatsAppClick}
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  size="large"
                >
                  <WhatsApp fontSize="large" />
                </IconButton>
                
                <IconButton
                  onClick={handleInstagramClick}
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  size="large"
                >
                  <Instagram fontSize="large" />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} MENINA MULHER. Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
