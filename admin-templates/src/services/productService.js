import { apiRequest, API_CONFIG } from './apiConfig.js';

export const productService = {
  // Listar produtos com filtros e paginação
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('pageSize', params.pageSize);
      if (params.search) queryParams.append('search', params.search);
      if (params.categoria) queryParams.append('categoria', params.categoria);

      const endpoint = `/products?${queryParams.toString()}`;
      const response = await apiRequest(endpoint);

      return response.success ? response.data : response;
    } catch (error) {
      // Fallback para localStorage durante desenvolvimento
      console.warn('API não disponível, usando localStorage:', error);
      return this.getProductsFromLocalStorage(params);
    }
  },

  // Obter produto por ID
  async getProductById(id) {
    try {
      const response = await apiRequest(`/products/${id}`);
      return response.success ? response.data : response;
    } catch (error) {
      console.warn('API não disponível, usando localStorage:', error);
      const products = this.getProductsFromLocalStorage();
      return products.find(p => p.id.toString() === id.toString());
    }
  },

  // Criar produto
  async createProduct(productData) {
    try {
      const formData = this.createFormData(productData);
      
      const response = await apiRequest('/products', {
        method: 'POST',
        body: formData
      });

      return response.success ? response.data : response;
    } catch (error) {
      console.warn('API não disponível, usando localStorage:', error);
      return this.saveProductToLocalStorage(productData);
    }
  },

  // Atualizar produto
  async updateProduct(id, productData) {
    try {
      const formData = this.createFormData(productData);
      
      const response = await apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: formData
      });

      return response.success ? response.data : response;
    } catch (error) {
      console.warn('API não disponível, usando localStorage:', error);
      return this.updateProductInLocalStorage(id, productData);
    }
  },

  // Excluir produto
  async deleteProduct(id) {
    try {
      const response = await apiRequest(`/products/${id}`, {
        method: 'DELETE'
      });

      return response.success;
    } catch (error) {
      console.warn('API não disponível, usando localStorage:', error);
      return this.deleteProductFromLocalStorage(id);
    }
  },

  // Obter dados do dashboard
  async getDashboardData() {
    try {
      const response = await apiRequest('/products/dashboard');
      return response.success ? response.data : response;
    } catch (error) {
      console.warn('API não disponível, calculando do localStorage:', error);
      const products = this.getProductsFromLocalStorage();
      return {
        total: products.length,
        categories: [...new Set(products.map(p => p.categoria))].length,
        totalValue: products.reduce((sum, p) => sum + (p.preco || 0), 0)
      };
    }
  },

  // Métodos auxiliares para localStorage (fallback)
  getProductsFromLocalStorage(params = {}) {
    const savedProducts = localStorage.getItem('admin_products');
    let products = savedProducts ? JSON.parse(savedProducts) : [];

    // Aplicar filtros
    if (params.search) {
      const search = params.search.toLowerCase();
      products = products.filter(product =>
        product.nome?.toLowerCase().includes(search) ||
        product.descricao?.toLowerCase().includes(search) ||
        product.categoria?.toLowerCase().includes(search) ||
        product.tags?.some(tag => tag.toLowerCase().includes(search))
      );
    }

    if (params.categoria) {
      products = products.filter(product => product.categoria === params.categoria);
    }

    // Simular paginação
    const page = parseInt(params.page) || 1;
    const pageSize = parseInt(params.pageSize) || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      items: products.slice(startIndex, endIndex),
      totalCount: products.length,
      currentPage: page,
      pageSize: pageSize,
      totalPages: Math.ceil(products.length / pageSize)
    };
  },

  saveProductToLocalStorage(productData) {
    const savedProducts = localStorage.getItem('admin_products');
    const products = savedProducts ? JSON.parse(savedProducts) : [];

    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);
    localStorage.setItem('admin_products', JSON.stringify(products));
    
    return newProduct;
  },

  updateProductInLocalStorage(id, productData) {
    const savedProducts = localStorage.getItem('admin_products');
    const products = savedProducts ? JSON.parse(savedProducts) : [];

    const index = products.findIndex(p => p.id.toString() === id.toString());
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...productData,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('admin_products', JSON.stringify(products));
      return products[index];
    }

    throw new Error('Produto não encontrado');
  },

  deleteProductFromLocalStorage(id) {
    const savedProducts = localStorage.getItem('admin_products');
    const products = savedProducts ? JSON.parse(savedProducts) : [];

    const filteredProducts = products.filter(p => p.id.toString() !== id.toString());
    localStorage.setItem('admin_products', JSON.stringify(filteredProducts));
    
    return filteredProducts.length < products.length;
  },

  // Criar FormData para upload
  createFormData(productData) {
    const formData = new FormData();

    // Adicionar campos básicos
    Object.keys(productData).forEach(key => {
      if (key === 'imagens' || key === 'tags' || key === 'tamanhos') {
        return; // Tratar separadamente
      }

      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });

    // Adicionar arrays
    if (productData.tags) {
      productData.tags.forEach(tag => formData.append('tags[]', tag));
    }

    if (productData.tamanhos) {
      productData.tamanhos.forEach(tamanho => formData.append('tamanhos[]', tamanho));
    }

    // Adicionar imagens
    if (productData.imagens) {
      productData.imagens.forEach((image, index) => {
        if (image instanceof File) {
          formData.append('imagens', image);
        } else if (typeof image === 'string') {
          formData.append('imagensUrls[]', image);
        }
      });
    }

    return formData;
  },

  // Validar arquivo de imagem
  validateImageFile(file) {
    if (!file) return { valid: false, error: 'Nenhum arquivo selecionado' };

    if (file.size > API_CONFIG.maxFileSize) {
      return { 
        valid: false, 
        error: `Arquivo muito grande. Máximo: ${API_CONFIG.maxFileSize / 1024 / 1024}MB` 
      };
    }

    if (!API_CONFIG.allowedFileTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Tipo de arquivo não permitido. Use: JPEG, PNG, GIF ou WebP' 
      };
    }

    return { valid: true };
  }
};
