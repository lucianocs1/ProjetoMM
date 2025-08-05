import { apiRequest } from './apiConfig.js';

export const authService = {
  // Login do administrador
  async login(credentials) {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: credentials
      });

      if (response.success && response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_logged_in', 'true');
        return response.data;
      }

      throw new Error(response.message || 'Erro no login');
    } catch (error) {
      // Fallback para desenvolvimento - remover em produção
      if (credentials.password === 'admin123') {
        localStorage.setItem('admin_logged_in', 'true');
        return { success: true, message: 'Login local (desenvolvimento)' };
      }
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.warn('Erro no logout da API:', error);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_logged_in');
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
  }
};
