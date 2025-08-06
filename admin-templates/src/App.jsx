import React, { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box, Backdrop, CircularProgress, Typography } from '@mui/material'
import Login from './Login'
import ProductManager from '../ProductManager'
import { authService } from './services/authService'

const theme = createTheme({
  palette: {
    primary: {
      main: '#E91E63',
    },
    secondary: {
      main: '#9C27B0',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
})

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)

  useEffect(() => {
    // Verificação simples e limpa
    const checkAuth = () => {
      console.log('🔍 Iniciando verificação de auth...');
      
      const token = authService.getToken();
      const isLoggedFlag = authService.isAuthenticated();
      
      console.log('📋 Estado atual:', {
        hasToken: !!token,
        isLoggedFlag: isLoggedFlag
      });
      
      // Se não tem token OU não está marcado como logado, limpar tudo e ir para login
      if (!token || !isLoggedFlag) {
        console.log('❌ Sem credenciais válidas - limpando dados e indo para login');
        authService.logout(); // Limpar qualquer dado residual
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      // Se tem token E está marcado como logado, verificar no servidor
      console.log('🎫 Credenciais encontradas, verificando no servidor...');
      authService.verifyToken()
        .then(isValid => {
          if (isValid) {
            console.log('✅ Token válido');
            setIsAuthenticated(true);
          } else {
            console.log('❌ Token inválido');
            setIsAuthenticated(false);
          }
        })
        .catch(error => {
          console.error('❌ Erro na verificação:', error);
          setIsAuthenticated(false);
        })
        .finally(() => {
          console.log('🏁 Verificação concluída');
          setIsLoading(false);
        });
    };

    checkAuth();
  }, [])

  const handleLogin = async (credentials) => {
    try {
      await authService.login(credentials);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  const handleLogout = async () => {
    try {
      setLogoutLoading(true)
      
      // Delay mínimo para garantir que o loading seja visível
      const [logoutResult] = await Promise.all([
        authService.logout(),
        new Promise(resolve => setTimeout(resolve, 1000)) // 1 segundo mínimo
      ]);
      
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setLogoutLoading(false)
    }
  }

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: 2,
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 6,
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 4,
            boxShadow: '0 24px 48px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            minWidth: 300,
          }}>
            <CircularProgress 
              size={80} 
              color="primary" 
              thickness={4}
              sx={{
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.7, transform: 'scale(1.05)' },
                  '100%': { opacity: 1, transform: 'scale(1)' },
                },
              }}
            />
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #E91E63, #9C27B0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Carregando Sistema
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ opacity: 0.8 }}
              >
                Preparando o ambiente...
              </Typography>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
          <ProductManager onLogout={handleLogout} logoutLoading={logoutLoading} />
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App
