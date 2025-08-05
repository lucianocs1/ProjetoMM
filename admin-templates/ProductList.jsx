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
import { Edit, Delete, Image } from '@mui/icons-material'

const ProductList = ({ products, onEdit, onDelete }) => {
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
            <TableCell>Tamanhos</TableCell>
            <TableCell>Tags</TableCell>
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
                  {product.nome}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {product.descricao.length > 50 
                    ? `${product.descricao.substring(0, 50)}...`
                    : product.descricao
                  }
                </Typography>
              </TableCell>
              
              <TableCell>
                <Chip 
                  label={product.categoria} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </TableCell>
              
              <TableCell>
                <Typography variant="h6" color="primary">
                  {formatPrice(product.preco)}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
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
              
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {product.tags?.slice(0, 2).map(tag => (
                    <Chip 
                      key={tag}
                      label={tag} 
                      size="small" 
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                  {product.tags?.length > 2 && (
                    <Chip 
                      label={`+${product.tags.length - 2}`}
                      size="small" 
                      variant="outlined"
                      color="info"
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
                {formatDate(product.createdAt)}
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
