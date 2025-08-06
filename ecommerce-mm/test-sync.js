// Teste da funcionalidade de sincronização
import { ecommerceApi } from '../src/services/api.js'

// Simular produtos do admin no localStorage
const mockAdminProducts = [
  {
    id: 'admin_1',
    nome: 'Blusa Teste Admin',
    descricao: 'Blusa criada no admin para teste',
    categoria: 'Roupas',
    preco: 89.90,
    tamanhos: ['P', 'M', 'G', '36', '37'], // Tamanhos mistos para testar filtro
    tags: ['teste', 'admin'],
    createdAt: new Date().toISOString(),
    imagens: [{data: 'https://via.placeholder.com/300x300'}]
  },
  {
    id: 'admin_2', 
    nome: 'Bolsa Teste Admin',
    descricao: 'Bolsa criada no admin para teste',
    categoria: 'Bolsas',
    preco: 159.90,
    tamanhos: ['P', 'M', 'G'], // Será convertido para "Único"
    tags: ['teste', 'admin'],
    createdAt: new Date().toISOString(),
    imagens: [{data: 'https://via.placeholder.com/300x300'}]
  },
  {
    id: 'admin_3',
    nome: 'Sapato Teste Admin', 
    descricao: 'Sapato criado no admin para teste',
    categoria: 'Sapatos',
    preco: 199.90,
    tamanhos: ['P', 'M', '35', '36', '37', '50'], // Misturado, só números válidos devem passar
    tags: ['teste', 'admin'],
    createdAt: new Date().toISOString(),
    imagens: [{data: 'https://via.placeholder.com/300x300'}]
  }
]

// Salvar no localStorage para simular produtos do admin
localStorage.setItem('admin_products', JSON.stringify(mockAdminProducts))

// Testar formatação de tamanhos
console.log('=== TESTE DE FORMATAÇÃO DE TAMANHOS ===')

console.log('Roupas:', ecommerceApi.formatSizesByCategory(['P', 'M', 'G', '36', '37'], 'Roupas'))
// Esperado: ['P', 'M', 'G']

console.log('Bolsas:', ecommerceApi.formatSizesByCategory(['P', 'M', 'G'], 'Bolsas'))  
// Esperado: ['Único']

console.log('Sapatos:', ecommerceApi.formatSizesByCategory(['P', 'M', '35', '36', '37', '50'], 'Sapatos'))
// Esperado: ['35', '36', '37']

// Testar busca de produtos do admin
console.log('\n=== TESTE DE BUSCA ADMIN ===')

const roupasAdmin = ecommerceApi.getProductsFromAdmin('roupas')
console.log('Roupas admin:', roupasAdmin.length, 'produto(s)')

const bolsasAdmin = ecommerceApi.getProductsFromAdmin('bolsas')  
console.log('Bolsas admin:', bolsasAdmin.length, 'produto(s)')

const sapatosAdmin = ecommerceApi.getProductsFromAdmin('sapatos')
console.log('Sapatos admin:', sapatosAdmin.length, 'produto(s)')

console.log('\n=== TESTE CONCLUÍDO ===')
console.log('Verifique se os produtos aparecem nas páginas:')
console.log('- /roupas (deve ter blusa com tamanhos P, M, G)')
console.log('- /bolsas (deve ter bolsa com tamanho Único)')  
console.log('- /sapatos (deve ter sapato com tamanhos 35, 36, 37)')
