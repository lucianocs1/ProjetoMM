import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  IconButton,
  Collapse,
  Alert,
  Link,
  Chip
} from '@mui/material'
import { Close, Cookie, Security, Info } from '@mui/icons-material'

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const cookieConsent = localStorage.getItem('cookie_consent')
    
    if (!cookieConsent) {
      setShowBanner(true)
    }
  }, [])

  const handleAcceptAll = () => {
    try {
      // Salvar consentimento no localStorage
      localStorage.setItem('cookie_consent', 'accepted')
      localStorage.setItem('cookie_consent_date', new Date().toISOString())
      
      console.log('🍪 Cookies aceitos pelo usuário')
      setShowBanner(false)
    } catch (error) {
      console.error('Erro ao salvar consentimento:', error)
    }
  }

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem('cookie_consent', 'essential_only')
      localStorage.setItem('cookie_consent_date', new Date().toISOString())
      
      console.log('🍪 Apenas cookies essenciais aceitos')
      setShowBanner(false)
    } catch (error) {
      console.error('Erro ao salvar consentimento:', error)
    }
  }

  const handleReject = () => {
    try {
      localStorage.setItem('cookie_consent', 'rejected')
      localStorage.setItem('cookie_consent_date', new Date().toISOString())
      
      console.log('🍪 Cookies rejeitados pelo usuário')
      setShowBanner(false)
    } catch (error) {
      console.error('Erro ao salvar consentimento:', error)
    }
  }

  const resetCookieConsent = () => {
    localStorage.removeItem('cookie_consent')
    localStorage.removeItem('cookie_consent_date')
    setShowBanner(true)
    console.log('🔄 Consentimento de cookies resetado')
  }

  if (!showBanner) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        boxShadow: 3,
        zIndex: 9999,
        p: 3
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Cookie color="primary" />
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              🍪 Política de Cookies
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e analisar o tráfego. 
              Ao continuar navegando, você concorda com nossa política de cookies.
            </Typography>

            <Collapse in={showDetails}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Tipos de cookies utilizados:
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip 
                    label="Essenciais" 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                  />
                  <Chip 
                    label="Funcionais" 
                    size="small" 
                    color="secondary" 
                    variant="outlined"
                  />
                  <Chip 
                    label="Analytics" 
                    size="small" 
                    color="info" 
                    variant="outlined"
                  />
                  <Chip 
                    label="Preferências" 
                    size="small" 
                    color="success" 
                    variant="outlined"
                  />
                </Box>

                <Typography variant="body2">
                  • <strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do site<br/>
                  • <strong>Cookies Funcionais:</strong> Melhoram a experiência do usuário<br/>
                  • <strong>Cookies Analytics:</strong> Ajudam a entender como você usa o site<br/>
                  • <strong>Cookies de Preferências:</strong> Lembram suas configurações (tema, idioma)
                </Typography>
              </Alert>
            </Collapse>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleAcceptAll}
                sx={{
                  background: 'linear-gradient(45deg, #E91E63 30%, #F06292 90%)',
                  color: 'white'
                }}
              >
                Aceitar Todos
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                onClick={handleAcceptEssential}
              >
                Apenas Essenciais
              </Button>
              
              <Button
                variant="text"
                size="small"
                onClick={handleReject}
                color="error"
              >
                Rejeitar
              </Button>
              
              <Button
                variant="text"
                size="small"
                onClick={() => setShowDetails(!showDetails)}
                startIcon={<Info />}
              >
                {showDetails ? 'Menos' : 'Mais'} Detalhes
              </Button>

              {/* Botão de desenvolvimento */}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="text"
                  size="small"
                  onClick={resetCookieConsent}
                  color="warning"
                >
                  🔄 Reset (Dev)
                </Button>
              )}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Para mais informações, consulte nossa{' '}
              <Link href="/privacy" underline="hover">
                Política de Privacidade
              </Link>
              {' '}em conformidade com a LGPD.
            </Typography>
          </Box>

          <IconButton
            onClick={() => setShowBanner(false)}
            size="small"
            sx={{ mt: -1 }}
          >
            <Close />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default CookieBanner
