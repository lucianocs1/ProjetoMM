// Teste direto do endpoint
import { productService } from './src/services/apiService.js'

async function testBolsas() {
  try {
    console.log('🔄 Testando productService.getByCategory("bolsas")...')
    const products = await productService.getByCategory('bolsas')
    console.log('✅ Resultado:', products.length, 'produtos')
    products.forEach(p => console.log('  -', p.name, '(categoria:', p.category + ')'))
  } catch (error) {
    console.error('❌ Erro:', error.message)
  }
}

testBolsas()
