// Modelos de dados para TypeScript-like documentation
// Defina estes tipos no seu backend .NET

export const ProductModel = {
  id: 'number',
  nome: 'string',
  descricao: 'string', 
  preco: 'decimal',
  categoria: 'string',
  tamanhos: 'string[]',
  imagens: 'string[]', // URLs das imagens
  tags: 'string[]',
  promocoes: 'string?', // nullable
  ativo: 'boolean',
  criadoEm: 'DateTime',
  atualizadoEm: 'DateTime?'
}

export const CategoryModel = {
  id: 'number',
  nome: 'string',
  descricao: 'string?',
  ativo: 'boolean'
}

// DTOs para requests
export const CreateProductDto = {
  nome: 'string',
  descricao: 'string',
  preco: 'decimal',
  categoria: 'string',
  tamanhos: 'string[]',
  imagens: 'string[]',
  tags: 'string[]',
  promocoes: 'string?'
}

export const UpdateProductDto = {
  id: 'number',
  nome: 'string?',
  descricao: 'string?',
  preco: 'decimal?',
  categoria: 'string?',
  tamanhos: 'string[]?',
  imagens: 'string[]?',
  tags: 'string[]?',
  promocoes: 'string?',
  ativo: 'boolean?'
}

export const SearchProductDto = {
  searchTerm: 'string',
  categoria: 'string?',
  precoMin: 'decimal?',
  precoMax: 'decimal?',
  tamanhos: 'string[]?',
  tags: 'string[]?',
  pageNumber: 'number?',
  pageSize: 'number?'
}
