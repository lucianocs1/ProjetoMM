// Teste direto da API do frontend
const testFrontendAPI = async () => {
  console.log('=== TESTE DA API DO FRONTEND ===')
  
  try {
    // Importar o serviço da API
    const { ecommerceApi } = await import('./src/services/api.js')
    
    console.log('1. Testando getProducts()...')
    const allProducts = await ecommerceApi.getProducts()
    console.log('Produtos retornados:', allProducts)
    
    console.log('2. Testando getProductsWithFallback()...')
    const fallbackProducts = await ecommerceApi.getProductsWithFallback()
    console.log('Produtos com fallback:', fallbackProducts)
    
    console.log('3. Testando getProductsByCategory("Bolsas")...')
    const bolsasProducts = await ecommerceApi.getProductsByCategory('Bolsas')
    console.log('Produtos de Bolsas:', bolsasProducts)
    
    console.log('4. Testando chamada direta à API...')
    const directAPI = await fetch('http://localhost:5005/api/products')
    const directData = await directAPI.json()
    console.log('API direta:', directData)
    
  } catch (error) {
    console.error('Erro no teste:', error)
  }
}

// Executar quando carregado
if (typeof window !== 'undefined') {
  window.testFrontendAPI = testFrontendAPI
  testFrontendAPI()
}
