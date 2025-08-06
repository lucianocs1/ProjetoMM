// Teste da API
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5005,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.end();
  });
}

async function testAPI() {
  try {
    console.log('Testando endpoint de todos os produtos...');
    const allProducts = await makeRequest('/api/products');
    console.log('Total de produtos:', allProducts.length);
    console.log('Primeiro produto (estrutura):', JSON.stringify(allProducts[0], null, 2));
    console.log('Categorias encontradas:', [...new Set(allProducts.map(p => p.Category || p.category))]);
    
    console.log('\nTestando endpoint de categoria bolsas...');
    const bolsasProducts = await makeRequest('/api/products/category/bolsas');
    console.log('Produtos de bolsas:', bolsasProducts.length);
    
    console.log('\nProdutos retornados para bolsas:');
    if (Array.isArray(bolsasProducts)) {
      bolsasProducts.forEach(p => console.log('- ID:', p.Id || p.id, 'Nome:', p.Name || p.name, 'Categoria:', p.Category || p.category));
    } else {
      console.log('Resposta não é um array:', bolsasProducts);
    }
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

testAPI();
