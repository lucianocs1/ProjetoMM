import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CustomThemeProvider } from './contexts/ThemeContext'
import { analytics, serviceWorker } from './services/webServices'
import './index.css'
import App from './App.jsx'

// Inicializar serviços web em produção
if (import.meta.env.VITE_NODE_ENV === 'production') {
  // Service Worker para PWA
  serviceWorker.register()
  
  // Rastrear carregamento inicial da página
  analytics.trackPageView(window.location.pathname, document.title)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CustomThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CustomThemeProvider>
  </StrictMode>,
)
