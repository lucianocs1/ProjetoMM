// Configurações da API
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880, // 5MB
  allowedFileTypes: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp'
  ]
};

// Headers padrão
export const getDefaultHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Adicionar token de autenticação se existir
  const token = localStorage.getItem('admin_token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Interceptador de resposta para lidar com erros
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

// Função auxiliar para fazer requests
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const config = {
    method: 'GET',
    headers: getDefaultHeaders(),
    ...options,
  };

  // Se não for FormData, stringify o body
  if (config.body && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  // Para FormData, remover Content-Type para deixar o browser definir
  if (config.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, config);
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`API Error - ${config.method} ${endpoint}:`, error);
    throw error;
  }
};
