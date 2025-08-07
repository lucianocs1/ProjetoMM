// Configuração da API para produção web
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000
const IS_PRODUCTION = import.meta.env.VITE_NODE_ENV === 'production'

const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
}

// Cache para requests em desenvolvimento
const requestCache = new Map()
const CACHE_DURATION = IS_PRODUCTION ? 0 : 5 * 60 * 1000 // 5 minutos em dev

// Função helper para fazer requests com retry e cache
const apiRequest = async (endpoint, options = {}) => {
  const url = `${apiConfig.baseURL}${endpoint}`
  const cacheKey = `${options.method || 'GET'}-${url}-${JSON.stringify(options.data || {})}`
  
  // Verificar cache apenas em desenvolvimento
  if (!IS_PRODUCTION && options.method === 'GET') {
    const cached = requestCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('🔄 Cache hit:', endpoint)
      return cached.data
    }
  }
  
  const config = {
    method: options.method || 'GET',
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    },
    signal: AbortSignal.timeout(apiConfig.timeout),
    ...options,
  }

  if (config.method !== 'GET' && options.data) {
    config.body = JSON.stringify(options.data)
  }

  try {
    // Implementar retry logic para produção
    let lastError
    const maxRetries = IS_PRODUCTION ? 3 : 1
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout)
        
        const response = await fetch(url, { 
          ...config, 
          signal: controller.signal 
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        
        // Cache apenas GET requests bem-sucedidas
        if (!IS_PRODUCTION && config.method === 'GET') {
          requestCache.set(cacheKey, {
            data: { data, error: null },
            timestamp: Date.now()
          })
        }
        
        return { data, error: null }
        
      } catch (error) {
        lastError = error
        
        if (attempt < maxRetries) {
          // Delay exponencial para retry
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
          continue
        }
        
        break
      }
    }
    
    // Tratamento de erro após todas as tentativas
    if (lastError.message.includes('Failed to fetch') || 
        lastError.name === 'TypeError' || 
        lastError.name === 'AbortError') {
      
      if (!IS_PRODUCTION) {
        console.log('⚠️ API indisponível, usando dados locais:', endpoint)
      }
      
      return { data: null, error: 'API_UNAVAILABLE' }
    }
    
    if (!IS_PRODUCTION) {
      console.error('❌ Erro na requisição:', lastError.message)
    }
    
    return { data: null, error: lastError.message }
    
  } catch (error) {
    if (!IS_PRODUCTION) {
      console.error('❌ Erro inesperado:', error)
    }
    return { data: null, error: 'NETWORK_ERROR' }
  }
}// Serviço para integração com a API do e-commerce
class EcommerceApiService {
  // Buscar todos os produtos
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.categoria) queryParams.append('categoria', params.categoria);
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);

      const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      console.log('🔍 Tentando buscar produtos...');
      const response = await apiRequest(endpoint);
      
      // Se houve erro na requisição
      if (response.error) {
        console.error('💥 Erro na API:', response.error);
        throw new Error(response.error);
      }
      
      console.log('🔍 Resposta da API completa:', response);
      
      // A API pode retornar formato { value: [...], Count: n } ou array direto
      if (response.data) {
        // Se tem propriedade 'value', é o formato estruturado
        if (response.data.value && Array.isArray(response.data.value)) {
          console.log('📦 Formato estruturado detectado:', response.data.value.length, 'produtos');
          return response.data.value;
        }
        
        // Se é array direto
        if (Array.isArray(response.data)) {
          console.log('📦 Array direto detectado:', response.data.length, 'produtos');
          return response.data;
        }
        
        // Se tem propriedade success (formato admin)
        if (response.data.success && response.data.data) {
          console.log('📦 Formato admin detectado');
          return Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        }
      }
      
      console.warn('⚠️ Formato de resposta não reconhecido, retornando array vazio');
      return [];
      
    } catch (error) {
      console.error('❌ Erro ao buscar produtos da API:', error.message);
      console.log('🔄 Retornando array vazio como fallback');
      throw error; // Re-throw para o hook lidar com o erro
    }
  }

  // Buscar produto por ID
  async getProductById(id) {
    try {
      const response = await apiRequest(`/products/${id}`);
      if (response.data && response.data.success) {
        return this.formatProduct(response.data.data);
      }
      return null;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      return null;
    }
  }

  // Buscar produtos por categoria
  async getProductsByCategory(categoria, params = {}) {
    const result = await this.getProducts({ ...params, categoria });
    
    if (result.items && result.items.length > 0) {
      return result.items.map(product => this.formatProduct(product));
    }
    
    return [];
  }

  // Buscar todas as categorias
  async getCategories() {
    try {
      const response = await apiRequest('/categories');
      if (response.data && response.data.success) {
        return response.data.data.items || [];
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  }

  // Formatação de dados para compatibilidade
  formatProduct(product) {
    return {
      id: product.id,
      name: product.name || product.nome,
      description: product.description || product.descricao,
      price: this.formatPrice(product.originalPrice || product.precoPromocional || product.price || product.preco),
      originalPrice: product.originalPrice ? this.formatPrice(product.price || product.preco) : null,
      actualPrice: parseFloat(product.price || product.preco || 0),
      image: this.getProductImageUrl(product.image || product.imagens?.[0]),
      images: product.images?.map(img => this.getProductImageUrl(img)) || 
              product.imagens?.map(img => this.getProductImageUrl(img)) || 
              [this.getProductImageUrl(product.image)],
      sizes: this.formatSizesByCategory(product.sizes || product.tamanhos, product.category || product.categoria),
      category: product.category || product.categoria,
      isNew: product.isNew !== undefined ? product.isNew : this.isNewProduct(product.createdAt || product.criadoEm),
      tags: product.tags || [],
      promocoes: product.promocoes || product.promotion
    };
  }

  // Formatar tamanhos baseado na categoria
  formatSizesByCategory(sizes, category) {
    if (!sizes || !Array.isArray(sizes)) return [];
    
    const categoryLower = category?.toLowerCase() || '';
    
    // Regras específicas por categoria
    if (categoryLower.includes('roupas') || categoryLower.includes('blusa')) {
      // Roupas: manter tamanhos como P, M, G, GG
      return sizes.filter(size => ['PP', 'P', 'M', 'G', 'GG', 'XG'].includes(size.toUpperCase()));
    } else if (categoryLower.includes('bolsa')) {
      // Bolsas: sempre "Único" ou sem tamanhos
      return ['Único'];
    } else if (categoryLower.includes('sapato')) {
      // Sapatos: apenas números
      return sizes.filter(size => /^\d{2}$/.test(size) && parseInt(size) >= 34 && parseInt(size) <= 42);
    }
    
    // Padrão: retornar como está
    return sizes;
  }

  // Formatar preço para exibição (R$ 99,90)
  formatPrice(price) {
    if (!price) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price).replace('R$', '').trim().replace('.', ',');
  }

  // Gerar URL completa da imagem
  getProductImageUrl(imagePath) {
    if (!imagePath) return 'https://via.placeholder.com/300x300?text=Sem+Imagem';
    
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `http://localhost:5006${imagePath}`;
    
    return `http://localhost:5006/uploads/products/${imagePath}`;
  }

  // Verificar se produto é novo (últimos 30 dias)
  isNewProduct(criadoEm) {
    if (!criadoEm) return false;
    
    const productDate = new Date(criadoEm);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return productDate > thirtyDaysAgo;
  }

  // Buscar produtos apenas da API e admin (sem fallback estático)
  async getProductsWithFallback(categoria = null) {
    try {
      // Primeiro: tentar buscar da API
      const apiProducts = await (categoria ? 
        this.getProductsByCategory(categoria) : 
        this.getProducts()
      );

      if (apiProducts.items && apiProducts.items.length > 0) {
        const formattedProducts = apiProducts.items.map(product => this.formatProduct(product));
        console.log(`Produtos carregados da API (${categoria || 'todas categorias'}):`, formattedProducts.length);
        return formattedProducts;
      } else if (apiProducts.length > 0) {
        console.log(`Produtos carregados da API (${categoria || 'todas categorias'}):`, apiProducts.length);
        return apiProducts;
      }
    } catch (error) {
      console.warn('API não disponível, tentando produtos do admin:', error);
    }

    // Segundo: verificar produtos do admin no localStorage
    const adminProducts = this.getProductsFromAdmin(categoria);
    if (adminProducts.length > 0) {
      console.log(`Produtos carregados do admin (${categoria || 'todas categorias'}):`, adminProducts.length);
      return adminProducts;
    }

    // Se não encontrou nada, retornar array vazio
    console.log(`Nenhum produto encontrado para: ${categoria || 'todas categorias'}`);
    return [];
  }

  // Buscar produtos criados no admin
  getProductsFromAdmin(categoria = null) {
    try {
      const adminProductsData = localStorage.getItem('admin_products');
      if (!adminProductsData) return [];

      const adminProducts = JSON.parse(adminProductsData);
      
      let filteredProducts = adminProducts.map(product => this.formatProduct({
        id: product.id,
        nome: product.nome,
        descricao: product.descricao,
        preco: product.preco,
        precoPromocional: product.promocao?.isActive ? product.precoOriginal : null,
        categoria: product.categoria,
        tamanhos: product.tamanhos,
        tags: product.tags,
        imagens: product.imagens?.map(img => img.data || img) || [product.image],
        criadoEm: product.createdAt,
        promocoes: product.promocao
      }));

      // Filtrar por categoria se especificada
      if (categoria) {
        const categoriaLower = categoria.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
          product.category.toLowerCase().includes(categoriaLower) ||
          (categoriaLower === 'roupas' && (
            product.category.toLowerCase().includes('blusa') ||
            product.category.toLowerCase().includes('roupa')
          ))
        );
      }

      return filteredProducts;
    } catch (error) {
      console.error('Erro ao carregar produtos do admin:', error);
      return [];
    }
  }

  // Dados estáticos como fallback
  getStaticProducts(categoria = null) {
    const staticProducts = [
      {
        id: 1,
        name: 'Vestido Floral Midi',
        description: 'Vestido midi com estampa floral delicada, perfeito para o verão',
        price: '89,90',
        originalPrice: '119,90',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop&crop=center',
        sizes: ['P', 'M', 'G', 'GG'],
        category: 'Roupas',
        isNew: true
      },
      {
        id: 2,
        name: 'Bolsa Tote Grande',
        description: 'Bolsa tote espaçosa em couro sintético, ideal para o dia a dia',
        price: '159,90',
        originalPrice: '199,90',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&crop=center',
        sizes: ['Único'],
        category: 'Bolsas',
        isNew: false
      },
      {
        id: 3,
        name: 'Tênis Casual Branco',
        description: 'Tênis casual confortável para o dia a dia',
        price: '199,90',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center',
        sizes: ['36', '37', '38', '39', '40'],
        category: 'Sapatos',
        isNew: true
      }
    ];

    return categoria ? 
      staticProducts.filter(p => p.category.toLowerCase() === categoria.toLowerCase()) :
      staticProducts;
  }
}

export const ecommerceApi = new EcommerceApiService();
export { apiRequest, API_BASE_URL }
