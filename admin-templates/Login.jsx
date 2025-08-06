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
import { Lock, Visibility, VisibilityOff, AdminPanelSettings, Person } from '@mui/icons-material'
import { authService } from './src/services/authService'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await authService.login({ username, password })
      onLogin()
    } catch (error) {
      setError('Usuário ou senha incorretos')
    } finally {
      setLoading(false)
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
                Admin Panel
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
                  type="text"
                  label="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Digite seu usuário"
                  required
                />

                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  label="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 3 }}
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
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Digite sua senha"
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #E91E63, #9C27B0)',
                    boxShadow: '0 8px 32px rgba(233, 30, 99, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #C2185B, #7B1FA2)',
                      boxShadow: '0 12px 40px rgba(233, 30, 99, 0.4)',
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Entrando...
                    </>
                  ) : (
                    'Entrar no Sistema'
                  )}
                </Button>
              </Box>

              {!loading && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                  💡 Use suas credenciais de administrador
                </Typography>
              )}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  )
}

export default Login
