import React, { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box, Backdrop, CircularProgress } from '@mui/material'
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

  useEffect(() => {
    // Verificar autenticação ao carregar
    const checkAuth = async () => {
      try {
        const authenticated = authService.isAuthenticated()
        setIsAuthenticated(authenticated)
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true)
      await authService.login(credentials)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await authService.logout()
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Backdrop
          sx={{ 
            color: '#fff', 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(102, 126, 234, 0.8)'
          }}
          open={true}
        >
          <CircularProgress color="inherit" size={60} />
        </Backdrop>
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
          <ProductManager onLogout={handleLogout} />
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App
