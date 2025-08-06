import { apiRequest } from './apiConfig.js';

export const authService = {
  // Login do administrador
  async login(credentials) {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: credentials
      });

      if (response.success && response.token) {
        localStorage.setItem('admin_token', response.token);
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_data', JSON.stringify(response.admin));
        return response;
      }

      throw new Error(response.message || 'Erro no login');
    } catch (error) {
      // Remover fallback de desenvolvimento em produção
      console.error('Erro de login:', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      const token = this.getToken();
      if (token) {
        await apiRequest('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.warn('Erro no logout da API:', error);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('admin_data');
    }
  },

  // Verificar se está autenticado
  isAuthenticated() {
    return localStorage.getItem('admin_logged_in') === 'true';
  },

  // Obter token
  getToken() {
    return localStorage.getItem('admin_token');
  },

  // Renovar token
  async refreshToken() {
    try {
      const response = await apiRequest('/auth/refresh', {
        method: 'POST'
      });

      if (response.success && response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        return response.data;
      }

      throw new Error('Erro ao renovar token');
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  // Obter dados do admin
  getAdminData() {
    const data = localStorage.getItem('admin_data');
    return data ? JSON.parse(data) : null;
  },

  // Verificar token no servidor
  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await apiRequest('/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.success;
    } catch (error) {
      console.warn('Token inválido:', error);
      this.logout(); // Limpar dados inválidos
      return false;
    }
  }
};
