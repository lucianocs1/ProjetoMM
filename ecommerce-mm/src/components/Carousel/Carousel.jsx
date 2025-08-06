import React, { useState, useEffect } from 'react'
import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'

const Carousel = ({ images = [], autoPlay = true, autoPlayDelay = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const theme = useTheme()

  const defaultImages = [
    {
      url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=500&fit=crop&crop=center',
      title: 'Nova Coleção Primavera',
      subtitle: 'Descubra as últimas tendências'
    },
    {
      url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=500&fit=crop&crop=center',
      title: 'Roupas em Destaque',
      subtitle: 'Estilo e conforto para o seu dia'
    },
    {
      url: 'https://plus.unsplash.com/premium_photo-1713820011342-e14587b2968d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Bolsas Exclusivas',
      subtitle: 'Sofisticação e praticidade em cada detalhe'
    }
  ]

  const slides = images.length > 0 ? images : defaultImages

  useEffect(() => {
    if (autoPlay && slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        )
      }, autoPlayDelay)

      return () => clearInterval(interval)
    }
  }, [autoPlay, autoPlayDelay, slides.length])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if (slides.length === 0) return null

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 300, md: 500 },
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: theme.shadows[4],
      }}
    >
      {/* Main Image */}
      <Box
        component="img"
        src={slides[currentIndex].url}
        alt={slides[currentIndex].title || `Slide ${currentIndex + 1}`}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.5s ease-in-out',
        }}
      />

      {/* Overlay with text */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          p: 3,
        }}
      >
        <Box>
          {slides[currentIndex].title && (
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                fontSize: { xs: '1.8rem', md: '3rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {slides[currentIndex].title}
            </Typography>
          )}
          {slides[currentIndex].subtitle && (
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1rem', md: '1.5rem' },
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {slides[currentIndex].subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <IconButton
            onClick={goToPrevious}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <ArrowBackIos />
          </IconButton>

          <IconButton
            onClick={goToNext}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <ArrowForwardIos />
          </IconButton>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default Carousel
