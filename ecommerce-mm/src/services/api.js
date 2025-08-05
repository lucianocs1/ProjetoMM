// Configuração da API para integração com .NET Backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7001/api'

const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
}

// Função helper para fazer requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${apiConfig.baseURL}${endpoint}`
  
  const config = {
    method: 'GET',
    headers: {
      ...apiConfig.headers,
      ...options.headers,
    },
    ...options,
  }

  if (config.method !== 'GET' && options.data) {
    config.body = JSON.stringify(options.data)
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    console.error('API Request Error:', error)
    return { data: null, error: error.message }
  }
}

export { apiRequest, API_BASE_URL }
