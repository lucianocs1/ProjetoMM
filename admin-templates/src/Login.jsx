import React, { useState } from 'react';
import {
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
} from '@mui/material';
import { Lock, Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: 'admin', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setCredentials(prev => ({ ...prev, [field]: event.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações mais específicas
    if (!credentials.username.trim()) {
      setError('Por favor, digite o nome de usuário');
      return;
    }
    
    if (!credentials.password.trim()) {
      setError('Por favor, digite a senha de administrador');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await onLogin(credentials);
    } catch (error) {
      // Mensagens de erro mais específicas e amigáveis
      let errorMessage = 'Erro no login. Tente novamente.';
      
      if (error.message) {
        const msg = error.message.toLowerCase();
        
        if (msg.includes('usuário ou senha inválidos')) {
          errorMessage = '🔑 Senha incorreta! Verifique a senha de administrador e tente novamente.';
        } else if (msg.includes('usuário ou senha') || msg.includes('inválid')) {
          errorMessage = '🔑 Credenciais incorretas! Verifique usuário e senha.';
        } else if (msg.includes('unauthorized') || msg.includes('401')) {
          errorMessage = '🔑 Senha incorreta! Verifique a senha de administrador e tente novamente.';
        } else if (msg.includes('forbidden') || msg.includes('403')) {
          errorMessage = '🚫 Acesso negado. Você não tem permissão de administrador.';
        } else if (msg.includes('network') || msg.includes('fetch')) {
          errorMessage = '🌐 Erro de conexão. Verifique sua internet e tente novamente.';
        } else if (msg.includes('timeout')) {
          errorMessage = '⏱️ Tempo limite excedido. Tente novamente.';
        } else if (msg.includes('server') || msg.includes('500')) {
          errorMessage = '⚠️ Erro no servidor. Tente novamente em alguns instantes.';
        } else {
          // Usar a mensagem original se for clara
          errorMessage = `❌ ${error.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 2,
    }}>
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
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                  placeholder="Senha do administrador"
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
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #C2185B, #7B1FA2)',
                      boxShadow: '0 12px 40px rgba(233, 30, 99, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: 'rgba(0,0,0,0.12)',
                      transform: 'none',
                    }
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={24} color="inherit" thickness={4} />
                      <Typography variant="body2" color="inherit">
                        Conectando...
                      </Typography>
                    </Box>
                  ) : (
                    'Entrar no Sistema'
                  )}
                </Button>
              </Box>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 3, 
                    borderRadius: 3,
                    border: '2px solid #f44336',
                    background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                    '& .MuiAlert-icon': {
                      fontSize: '1.5rem',
                    },
                    '& .MuiAlert-message': {
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      lineHeight: 1.4,
                    },
                    animation: 'shake 0.5s ease-in-out',
                    '@keyframes shake': {
                      '0%, 100%': { transform: 'translateX(0)' },
                      '25%': { transform: 'translateX(-4px)' },
                      '75%': { transform: 'translateX(4px)' },
                    },
                  }}
                >
                  {error}
                </Alert>
              )}
              {!error && (
                <Box sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderRadius: 2,
                  border: '1px solid rgba(25, 118, 210, 0.2)',
                }}>
                  <Typography 
                    variant="body2" 
                    color="primary" 
                    sx={{ 
                      fontWeight: 600,
                      textAlign: 'center',
                      mb: 1,
                    }}
                  >
                    💡 Credenciais de Acesso
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      display: 'block',
                      textAlign: 'center',
                      lineHeight: 1.4,
                    }}
                  >
                    Usuário: <strong>admin</strong><br />
                    Digite sua senha de administrador
                  </Typography>
                </Box>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Versão {import.meta.env.VITE_APP_VERSION || '1.0.0'}
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;
