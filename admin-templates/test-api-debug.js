// Script para testar a API diretamente e debug do isFeatured

console.log('🧪 Teste direto da API - Debug isFeatured');

async function testAPI() {
  try {
    // Teste 1: Chamada direta fetch
    console.log('\n=== TESTE 1: Fetch direto ===');
    const response = await fetch('http://localhost:5006/api/products');
    const directData = await response.json();
    
    console.log('📦 Resposta direta:', directData);
    console.log('📊 Tipo:', typeof directData);
    console.log('🔢 Length:', directData.length);
    console.log('👀 Primeiro produto:', directData[0]);
    console.log('⭐ isFeatured primeiro produto:', directData[0].isFeatured, typeof directData[0].isFeatured);
    
    // Teste 2: Simular conversão do ProductManager
    console.log('\n=== TESTE 2: Conversão ProductManager ===');
    const convertedProducts = directData.map(product => {
      const converted = {
        id: product.id?.toString() || Date.now().toString(),
        nome: product.name || product.nome || 'Produto sem nome',
        descricao: product.description || product.descricao || 'Sem descrição',
        preco: parseFloat(product.price || product.preco || 0),
        precoPromocional: product.originalPrice || product.precoPromocional || null,
        categoria: product.category || product.categoria || 'Sem categoria',
        categoriaId: product.categoryId || null,
        tamanhos: product.sizes || product.tamanhos || [],
        imagens: product.image ? [product.image] : (product.imagens || []),
        tags: product.tags || [],
        promocoes: (product.originalPrice || product.precoPromocional) ? 'Promoção' : (product.promocoes || ''),
        isNew: Boolean(product.isNew),
        isFeatured: Boolean(product.isFeatured),
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: product.updatedAt || new Date().toISOString()
      };
      
      console.log(`📦 ${product.name}:`, {
        'Original isFeatured': product.isFeatured,
        'Tipo original': typeof product.isFeatured,
        'Boolean(valor)': Boolean(product.isFeatured),
        'Convertido': converted.isFeatured,
        'Tipo convertido': typeof converted.isFeatured
      });
      
      return converted;
    });
    
    console.log('\n📋 Produtos convertidos:', convertedProducts);
    
    // Teste 3: Contar produtos em destaque
    const featuredCount = convertedProducts.filter(p => p.isFeatured).length;
    console.log(`\n⭐ Produtos em destaque: ${featuredCount}/${convertedProducts.length}`);
    
    convertedProducts.forEach(p => {
      if (p.isFeatured) {
        console.log(`✅ ${p.nome} está em destaque`);
      }
    });
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executar teste
testAPI();
