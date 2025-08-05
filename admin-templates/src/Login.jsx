import React, { useState } from 'react'
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Container,
  Card,
  CardContent,
  Avatar,
  Fade,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material'
import { Lock, Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material'

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: 'admin',
    password: ''
  })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field) => (event) => {
    setCredentials(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!credentials.password) {
      setError('Por favor, digite a senha')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await onLogin(credentials)
    } catch (error) {
      setError(error.message || 'Erro no login. Verifique suas credenciais.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Card elevation={24} sx={{ 
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)'
          }}>
            <CardContent sx={{ p: 5, textAlign: 'center' }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main', 
                mx: 'auto', 
                mb: 2,
                boxShadow: 3
              }}>
                <AdminPanelSettings sx={{ fontSize: 40 }} />
              </Avatar>
              
              <Typography variant="h3" gutterBottom sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #E91E63, #9C27B0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}>
                {import.meta.env.VITE_APP_NAME || 'Admin Panel'}
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Sistema de Gerenciamento de Produtos
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Usuário"
                  value={credentials.username}
                  onChange={handleChange('username')}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AdminPanelSettings color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Senha de Administrador"
                  value={credentials.password}
                  onChange={handleChange('password')}
                  variant="outlined"
                  sx={{ mb: 3 }}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Digite admin123"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #E91E63, #9C27B0)',
                    boxShadow: '0 8px 32px rgba(233, 30, 99, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #C2185B, #7B1FA2)',
                      boxShadow: '0 12px 40px rgba(233, 30, 99, 0.4)',
                    },
                    '&:disabled': {
                      background: 'rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Entrar no Sistema'
                  )}
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                💡 Dica: A senha padrão é <strong>admin123</strong>
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Versão {import.meta.env.VITE_APP_VERSION || '1.0.0'}
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  )
}

export default Login
