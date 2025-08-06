// Teste para verificar sincronização entre admin e API
const testProductSync = async () => {
  const API_BASE = 'http://localhost:5005/api'
  
  try {
    // 1. Verificar produtos na API
    console.log('=== PRODUTOS NA API ===')
    const apiResponse = await fetch(`${API_BASE}/products`)
    const apiData = await apiResponse.json()
    console.log('API Response:', apiData)
    
    if (apiData.value) {
      apiData.value.forEach(product => {
        console.log(`- ${product.name} (${product.category}) - ID: ${product.id}`)
      })
    }
    
    // 2. Verificar produtos no localStorage do admin
    console.log('\n=== PRODUTOS NO ADMIN (localStorage) ===')
    const adminProducts = localStorage.getItem('admin_products')
    if (adminProducts) {
      const products = JSON.parse(adminProducts)
      console.log('Admin products:', products.length)
      products.forEach(product => {
        console.log(`- ${product.nome} (${product.categoria}) - ID: ${product.id}`)
      })
    } else {
      console.log('Nenhum produto no localStorage do admin')
    }
    
    // 3. Testar criação de produto na API
    console.log('\n=== TESTE DE CRIAÇÃO ===')
    const testProduct = {
      name: 'Teste Produto API',
      description: 'Produto de teste para verificar sincronização',
      price: 99.90,
      originalPrice: null,
      categoryId: 3, // Bolsas
      sizes: ['Único'],
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center'
    }
    
    const createResponse = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`
      },
      body: JSON.stringify(testProduct)
    })
    
    if (createResponse.ok) {
      const created = await createResponse.json()
      console.log('Produto criado com sucesso:', created)
    } else {
      console.log('Erro ao criar produto:', createResponse.status, await createResponse.text())
    }
    
  } catch (error) {
    console.error('Erro no teste:', error)
  }
}

// Execute quando a página carregar
if (typeof window !== 'undefined') {
  testProductSync()
}

export { testProductSync }
