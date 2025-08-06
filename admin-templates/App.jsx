import React, { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Container, Box } from '@mui/material'
import Login from './Login'
import ProductManager from './ProductManager'

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
  const [logoutLoading, setLogoutLoading] = useState(false)

  useEffect(() => {
    // Verificar se já está logado
    const isLoggedIn = localStorage.getItem('admin_logged_in')
    if (isLoggedIn === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = () => {
    localStorage.setItem('admin_logged_in', 'true')
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    setLogoutLoading(true)
    
    try {
      // Simular delay para mostrar loading (remover em produção se não necessário)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      localStorage.removeItem('admin_logged_in')
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Erro durante logout:', error)
    } finally {
      setLogoutLoading(false)
    }
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
