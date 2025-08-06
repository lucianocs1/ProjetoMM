// Script de teste para debugging da criação de produtos
const testCreateProduct = async () => {
  console.log('=== TESTE DE CRIAÇÃO DE PRODUTO ===')
  
  try {
    // 1. Verificar se estamos autenticados
    const token = localStorage.getItem('admin_token')
    console.log('Token presente:', !!token)
    console.log('Token (primeiros 50 chars):', token ? token.substring(0, 50) + '...' : 'Não encontrado')
    
    // 2. Testar login se necessário
    if (!token) {
      console.log('Fazendo login...')
      const loginResponse = await fetch('http://localhost:5005/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123'
        })
      })
      
      const loginData = await loginResponse.json()
      console.log('Login response:', loginData)
      
      if (loginData.success && loginData.token) {
        localStorage.setItem('admin_token', loginData.token)
        console.log('Token salvo no localStorage')
      } else {
        console.error('Erro no login:', loginData)
        return
      }
    }
    
    // 3. Testar criação de produto
    const productData = {
      name: "Teste Debug Produto",
      description: "Produto criado para debug",
      price: 99.99,
      originalPrice: null,
      categoryId: 3, // Bolsas
      sizes: ["Único"],
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center",
      isNew: true
    }
    
    console.log('Enviando produto:', productData)
    
    const createResponse = await fetch('http://localhost:5005/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      },
      body: JSON.stringify(productData)
    })
    
    console.log('Status da resposta:', createResponse.status)
    console.log('Headers da resposta:', createResponse.headers)
    
    if (createResponse.ok) {
      const result = await createResponse.json()
      console.log('✅ Produto criado com sucesso:', result)
      
      // 4. Verificar se apareceu na lista
      const listResponse = await fetch('http://localhost:5005/api/products')
      const listData = await listResponse.json()
      console.log('Produtos na API após criação:', listData.value?.length || 0)
      
    } else {
      const errorText = await createResponse.text()
      console.error('❌ Erro ao criar produto:')
      console.error('Status:', createResponse.status)
      console.error('Texto do erro:', errorText)
      
      try {
        const errorJson = JSON.parse(errorText)
        console.error('JSON do erro:', errorJson)
      } catch (e) {
        console.error('Erro não é JSON válido')
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar teste
testCreateProduct()

// Disponibilizar no console
window.testCreateProduct = testCreateProduct
