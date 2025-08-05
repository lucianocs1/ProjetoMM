import React, { useState } from 'react'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Grid,
} from '@mui/material'
import { ExpandMore, FilterList, Clear } from '@mui/icons-material'

const ProductFilters = ({ onFiltersChange, products = [] }) => {
  const [filters, setFilters] = useState({
    search: '',
    priceRange: [0, 300],
    sizes: [],
    sortBy: 'name',
    isNew: false,
  })

  // Extrair tamanhos únicos dos produtos
  const availableSizes = [...new Set(
    products.flatMap(product => product.sizes || [])
  )].sort()

  const handleFilterChange = (filterType, value) => {
    // Sanitizar entrada de pesquisa básica
    let sanitizedValue = value
    if (filterType === 'search' && typeof value === 'string') {
      // Remove caracteres especiais perigosos
      sanitizedValue = value.replace(/[<>]/g, '').trim()
    }

    const newFilters = { ...filters, [filterType]: sanitizedValue }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleSizeToggle = (size) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size]
    handleFilterChange('sizes', newSizes)
  }

  const clearFilters = () => {
    const defaultFilters = {
      search: '',
      priceRange: [0, 300],
      sizes: [],
      sortBy: 'name',
      isNew: false,
    }
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const formatPrice = (value) => `R$ ${value}`

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <FilterList color="primary" />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Filtros
        </Typography>
        <Button
          startIcon={<Clear />}
          onClick={clearFilters}
          size="small"
          variant="outlined"
        >
          Limpar
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Busca */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Buscar produtos"
            variant="outlined"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            size="small"
          />
        </Grid>

        {/* Ordenação */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={filters.sortBy}
              label="Ordenar por"
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <MenuItem value="name">Nome</MenuItem>
              <MenuItem value="price_asc">Menor Preço</MenuItem>
              <MenuItem value="price_desc">Maior Preço</MenuItem>
              <MenuItem value="newest">Mais Novos</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Mostrar apenas novos */}
        <Grid item xs={12} md={4}>
          <Button
            variant={filters.isNew ? "contained" : "outlined"}
            onClick={() => handleFilterChange('isNew', !filters.isNew)}
            fullWidth
            sx={{ height: '40px' }}
          >
            {filters.isNew ? 'Mostrando Novos' : 'Apenas Novos'}
          </Button>
        </Grid>
      </Grid>

      {/* Filtros Avançados */}
      <Box sx={{ mt: 3 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Filtros Avançados</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {/* Faixa de Preço */}
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>
                  Faixa de Preço: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                </Typography>
                <Slider
                  value={filters.priceRange}
                  onChange={(e, value) => handleFilterChange('priceRange', value)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={formatPrice}
                  min={0}
                  max={300}
                  step={10}
                  color="primary"
                />
              </Grid>

              {/* Tamanhos */}
              <Grid item xs={12} md={6}>
                <Typography gutterBottom>Tamanhos</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availableSizes.map((size) => (
                    <Chip
                      key={size}
                      label={size}
                      onClick={() => handleSizeToggle(size)}
                      color={filters.sizes.includes(size) ? 'primary' : 'default'}
                      variant={filters.sizes.includes(size) ? 'filled' : 'outlined'}
                      clickable
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  )
}

export default ProductFilters
