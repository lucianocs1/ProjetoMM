import { Box, Typography, IconButton, Container, Grid } from '@mui/material'
import { Instagram, WhatsApp } from '@mui/icons-material'

const Footer = () => {
  const whatsappNumber = '5532984033503' // Número atualizado da MENINA MULHER
  const instagramHandle = '@meninamulher201' // Instagram oficial da loja

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Olá! Tenho interesse em seus produtos.`, '_blank')
  }

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/meninamulher201/', '_blank')
  }

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 2,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 1 }}>
                <Box component="span" sx={{ color: 'white' }}>
                  MENINA
                </Box>
                <Box component="span" sx={{ color: 'rgba(255, 255, 255, 0.8)', ml: 1 }}>
                  MULHER
                </Box>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, maxWidth: 500, mx: 'auto' }}>
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
              gap: 1.5 
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Fale Conosco
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <IconButton
                  onClick={handleWhatsAppClick}
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.3s ease',
                    p: 1
                  }}
                  size="medium"
                >
                  <WhatsApp fontSize="medium" />
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
                    transition: 'all 0.3s ease',
                    p: 1
                  }}
                  size="medium"
                >
                  <Instagram fontSize="medium" />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} MENINA MULHER. Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
