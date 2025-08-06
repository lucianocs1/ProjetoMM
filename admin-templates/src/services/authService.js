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

      // Se success = false, tratar como erro de credenciais
      if (response.success === false) {
        throw new Error(response.message || 'Usuário ou senha inválidos');
      }

      // Mensagens de erro mais específicas baseadas na resposta da API
      if (response.status === 401 || response.message?.includes('Unauthorized')) {
        throw new Error('Usuário ou senha incorretos');
      } else if (response.status === 403) {
        throw new Error('Acesso negado. Permissão de administrador necessária');
      } else if (response.status === 404) {
        throw new Error('Usuário não encontrado');
      } else if (response.status >= 500) {
        throw new Error('Erro interno do servidor. Tente novamente');
      }

      throw new Error(response.message || 'Credenciais inválidas');
    } catch (error) {
      // Se for erro de rede, melhorar a mensagem
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Erro de conexão com o servidor');
      }
      
      // Passar o erro original se já tiver uma mensagem específica
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
      // ...removido log...
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('admin_data');
    }
  },

  // Verificar se está autenticado
  isAuthenticated() {
    const result = localStorage.getItem('admin_logged_in') === 'true';
    return result;
  },

  // Obter token
  getToken() {
    const token = localStorage.getItem('admin_token');
    return token;
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
      if (!token) {
        console.log('🚫 Nenhum token para verificar');
        return false;
      }

      console.log('🔍 Verificando token no servidor...');
      const response = await apiRequest('/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ Resposta da verificação:', response);
      return response.Valid === true;
    } catch (error) {
      console.error('❌ Erro na verificação do token:', error);
      this.logout(); // Limpar dados inválidos
      return false;
    }
  }
};
