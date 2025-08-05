import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Switch,
  FormControlLabel,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Home,
  Checkroom,
  Woman,
  LocalMall,
  DarkMode,
  LightMode,
} from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'
import { useTheme as useCustomTheme } from '../../contexts/ThemeContext'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const { isDarkMode, toggleDarkMode } = useCustomTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()

  const menuItems = [
    { text: 'Home', path: '/', icon: <Home /> },
    { text: 'Roupas', path: '/roupas', icon: <Checkroom /> },
    { text: 'Bolsas', path: '/bolsas', icon: <Woman /> },
    { text: 'Sapatos', path: '/sapatos', icon: <LocalMall /> },
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
      {/* Logo no drawer */}
      <Typography variant="h6" sx={{ my: 3, px: 2 }}>
        <Box 
          component="span" 
          sx={{ 
            color: 'primary.main',
            background: 'linear-gradient(45deg, #e91e63, #f48fb1)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          MENINA
        </Box>
        <Box 
          component="span" 
          sx={{ 
            color: 'text.primary', 
            fontWeight: '300', 
            ml: 1 
          }}
        >
          MULHER
        </Box>
      </Typography>
      
      {/* Menu items com animação */}
      <List sx={{ px: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              borderRadius: '15px',
              mb: 1,
              mx: 1,
              backgroundColor: location.pathname === item.path ? 'rgba(233, 30, 99, 0.1)' : 'transparent',
              transition: 'all 0.3s ease',
              transform: `translateX(${mobileOpen ? '0' : '-100%'})`,
              animation: mobileOpen ? `slideInLeft 0.5s ease ${index * 0.1}s both` : 'none',
              '&:hover': {
                backgroundColor: 'rgba(233, 30, 99, 0.1)',
                transform: 'translateX(10px)',
                boxShadow: '0 4px 20px rgba(233, 30, 99, 0.2)',
              },
              '@keyframes slideInLeft': {
                '0%': {
                  transform: 'translateX(-100%)',
                  opacity: 0,
                },
                '100%': {
                  transform: 'translateX(0)',
                  opacity: 1,
                }
              }
            }}
          >
            <Box 
              sx={{ 
                mr: 2, 
                color: location.pathname === item.path ? 'primary.main' : 'inherit',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2) rotate(360deg)',
                }
              }}
            >
              {item.icon}
            </Box>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                }
              }}
            />
          </ListItem>
        ))}
        
        {/* Switch do tema no mobile */}
        <ListItem sx={{ justifyContent: 'center', mt: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={toggleDarkMode}
                color="primary"
                sx={{
                  '& .MuiSwitch-thumb': {
                    transition: 'all 0.3s ease',
                    boxShadow: isDarkMode 
                      ? '0 0 10px rgba(255, 213, 79, 0.6)' 
                      : '0 0 10px rgba(92, 107, 192, 0.4)',
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: isDarkMode ? '#ffd54f' : '#5c6bc0',
                  }
                }}
              />
            }
            label={
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}>
                {isDarkMode ? (
                  <DarkMode sx={{ color: '#ffd54f' }} />
                ) : (
                  <LightMode sx={{ color: '#5c6bc0' }} />
                )}
                <Typography variant="body2">
                  {isDarkMode ? 'Escuro' : 'Claro'}
                </Typography>
              </Box>
            }
          />
        </ListItem>
      </List>
    </Box>
  )

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: 'background.paper', 
          color: 'text.primary',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(233, 30, 99, 0.1)',
          transition: 'all 0.3s ease-in-out',
          overflow: 'hidden', // Evita que elementos saiam da tela
          '&:hover': {
            boxShadow: '0 12px 40px rgba(233, 30, 99, 0.15)',
          }
        }}
      >
        <Toolbar sx={{ 
          minHeight: { xs: '60px', md: '70px' }, 
          px: { xs: 1, sm: 2 },
          gap: { xs: 1, sm: 2 },
          overflow: 'visible', // Permite que o conteúdo seja visível
          position: 'relative' // Para melhor controle dos elementos filhos
        }}>
          {/* Mobile Menu Button - movido para antes do logo */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                transition: 'all 0.3s ease',
                borderRadius: '12px',
                minWidth: 'auto',
                '&:hover': {
                  backgroundColor: 'rgba(233, 30, 99, 0.1)',
                  transform: 'scale(1.1)',
                },
                '&:active': {
                  transform: 'scale(0.95)',
                }
              }}
            >
              <MenuIcon sx={{
                transition: 'transform 0.3s ease',
                ...(mobileOpen && { transform: 'rotate(90deg)' })
              }} />
            </IconButton>
          )}

          {/* Logo com responsividade melhorada */}
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease',
              fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
              minWidth: 0, // Permite quebra do texto
              '&:hover': {
                transform: { xs: 'none', md: 'scale(1.02)' },
              }
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                color: 'primary.main',
                background: 'linear-gradient(45deg, #e91e63, #f48fb1)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ad1457, #e91e63)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                }
              }}
            >
              MENINA
            </Box>
            <Box 
              component="span" 
              sx={{ 
                color: 'text.primary', 
                ml: { xs: 0.3, sm: 0.5, md: 1 },
                fontWeight: '300',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: 0,
                  height: '2px',
                  backgroundColor: 'primary.main',
                  transition: 'width 0.3s ease',
                  display: { xs: 'none', md: 'block' }
                },
                '&:hover::after': {
                  width: '100%',
                }
              }}
            >
              MULHER
            </Box>
          </Typography>

          {/* Desktop Menu com efeitos */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    borderRadius: '25px',
                    px: 3,
                    py: 1,
                    mx: 0.5,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, rgba(233, 30, 99, 0.1), rgba(244, 143, 177, 0.1))',
                      transition: 'left 0.5s ease',
                      zIndex: 0,
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(233, 30, 99, 0.08)',
                      color: 'primary.main',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 2px 8px rgba(233, 30, 99, 0.15)',
                      '&::before': {
                        left: 0,
                      },
                      '& .MuiSvgIcon-root': {
                        transform: 'rotate(180deg)',
                      }
                    },
                    '& .MuiSvgIcon-root': {
                      transition: 'transform 0.5s ease',
                    },
                    ...(location.pathname === item.path && {
                      backgroundColor: 'rgba(233, 30, 99, 0.1)',
                      color: 'primary.main',
                      boxShadow: '0 2px 10px rgba(233, 30, 99, 0.2)',
                    })
                  }}
                >
                  <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>
                    {item.text}
                  </Box>
                </Button>
              ))}
              
              {/* Theme Toggle com efeito - Desktop */}
              <IconButton
                onClick={toggleDarkMode}
                sx={{ 
                  color: 'text.primary',
                  ml: 2,
                  borderRadius: '50%',
                  padding: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isDarkMode 
                    ? 'linear-gradient(45deg, #424242, #616161)' 
                    : 'linear-gradient(45deg, #fff, #f5f5f5)',
                  boxShadow: isDarkMode 
                    ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
                    : '0 4px 20px rgba(233, 30, 99, 0.1)',
                  '&:hover': {
                    transform: 'scale(1.02) rotate(90deg)',
                    boxShadow: isDarkMode 
                      ? '0 3px 12px rgba(0, 0, 0, 0.25)' 
                      : '0 3px 12px rgba(233, 30, 99, 0.15)',
                  }
                }}
                title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              >
                {isDarkMode ? (
                  <LightMode sx={{ 
                    color: '#ffd54f',
                    filter: 'drop-shadow(0 0 8px rgba(255, 213, 79, 0.6))'
                  }} />
                ) : (
                  <DarkMode sx={{ 
                    color: '#5c6bc0',
                    filter: 'drop-shadow(0 0 8px rgba(92, 107, 192, 0.4))'
                  }} />
                )}
              </IconButton>
            </Box>
          )}

          {/* Mobile Actions */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Theme Toggle - Mobile */}
              <IconButton
                onClick={toggleDarkMode}
                sx={{ 
                  color: 'text.primary',
                  borderRadius: '50%',
                  padding: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(233, 30, 99, 0.08)',
                    transform: 'scale(1.02)',
                  }
                }}
                title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              >
                {isDarkMode ? (
                  <LightMode sx={{ color: '#ffd54f', fontSize: '1.2rem' }} />
                ) : (
                  <DarkMode sx={{ color: '#5c6bc0', fontSize: '1.2rem' }} />
                )}
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer com efeitos */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            background: isDarkMode 
              ? 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(233, 30, 99, 0.1)',
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(5px)',
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Navbar
