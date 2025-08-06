import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  Typography,
  Avatar,
  IconButton
} from '@mui/material'
import { Edit, Delete, Image, Star } from '@mui/icons-material'

const ProductList = ({ products, onEdit, onDelete }) => {
  // Debug: verificar produtos em destaque
  const featuredProducts = products.filter(p => p.isFeatured)
  if (featuredProducts.length > 0) {
    console.log('⭐ Produtos em destaque encontrados no ProductList:', featuredProducts.map(p => ({ nome: p.nome, isFeatured: p.isFeatured })))
  }

  if (products.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Image sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Nenhum produto cadastrado
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Clique em "Adicionar Produto" para começar
        </Typography>
      </Paper>
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Imagem</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell>Preço</TableCell>
            <TableCell align="center">Tamanhos</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell>Promoções</TableCell>
            <TableCell>Criado em</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} hover>
              <TableCell>
                {product.imagens && product.imagens.length > 0 ? (
                  <Avatar
                    src={product.imagens[0]}
                    alt={product.nome}
                    variant="rounded"
                    sx={{ width: 50, height: 50 }}
                  />
                ) : (
                  <Avatar variant="rounded" sx={{ width: 50, height: 50 }}>
                    <Image />
                  </Avatar>
                )}
              </TableCell>
              
              <TableCell>
                <Typography variant="subtitle2">
                  {product.nome || 'Produto sem nome'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {product.descricao && product.descricao.length > 50 
                    ? `${product.descricao.substring(0, 50)}...`
                    : product.descricao || 'Sem descrição'
                  }
                </Typography>
              </TableCell>
              
              <TableCell>
                <Chip 
                  label={product.categoria || 'Sem categoria'} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </TableCell>
              
              <TableCell>
                <Typography variant="h6" color="primary">
                  {formatPrice(product.preco || 0)}
                </Typography>
              </TableCell>
              
              <TableCell align="center">
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {product.tamanhos?.slice(0, 3).map(tamanho => (
                    <Chip 
                      key={tamanho}
                      label={tamanho} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                  {product.tamanhos?.length > 3 && (
                    <Chip 
                      label={`+${product.tamanhos.length - 3}`}
                      size="small" 
                      variant="outlined"
                      color="secondary"
                    />
                  )}
                </Box>
              </TableCell>
              
              <TableCell align="center">
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 0.5, 
                  justifyContent: 'center' 
                }}>
                  {product.isFeatured && (
                    <Chip 
                      icon={<Star />}
                      label="Destaque" 
                      size="small" 
                      color="warning"
                      variant="filled"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )}
                  {product.isNew && (
                    <Chip 
                      label="Novo" 
                      size="small" 
                      color="success"
                      variant="outlined"
                    />
                  )}
                </Box>
              </TableCell>
              
              <TableCell>
                {product.promocoes ? (
                  <Chip 
                    label={product.promocoes} 
                    size="small" 
                    color="success"
                    variant="filled"
                  />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    Sem promoção
                  </Typography>
                )}
              </TableCell>
              
              <TableCell>
                {formatDate(product.createdAt || new Date().toISOString())}
              </TableCell>
              
              <TableCell align="center">
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => onEdit(product)}
                  >
                    <Edit />
                  </IconButton>
                  
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja excluir "${product.nome}"?`)) {
                        onDelete(product.id)
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ProductList
