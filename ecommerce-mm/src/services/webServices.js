// Analytics e tracking para produção web
export class AnalyticsService {
  constructor() {
    this.isProduction = import.meta.env.VITE_NODE_ENV === 'production'
    this.analyticsEnabled = import.meta.env.VITE_ANALYTICS_ENABLED === 'true'
    this.gtag = null
    
    if (this.isProduction && this.analyticsEnabled) {
      this.initializeAnalytics()
    }
  }

  // Inicializar Google Analytics
  initializeAnalytics() {
    const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID
    const GTM_ID = import.meta.env.VITE_GOOGLE_TAG_MANAGER_ID
    
    if (GA_ID) {
      // Google Analytics 4
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      document.head.appendChild(script)
      
      window.dataLayer = window.dataLayer || []
      window.gtag = function() { window.dataLayer.push(arguments) }
      window.gtag('js', new Date())
      window.gtag('config', GA_ID, {
        page_title: document.title,
        page_location: window.location.href
      })
      
      this.gtag = window.gtag
    }
    
    if (GTM_ID) {
      // Google Tag Manager
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer', GTM_ID)
    }
  }

  // Rastrear page views
  trackPageView(page, title) {
    if (!this.analyticsEnabled || !this.gtag) return
    
    this.gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
      page_title: title,
      page_location: window.location.origin + page
    })
  }

  // Rastrear eventos personalizados
  trackEvent(action, category = 'engagement', label = '', value = 0) {
    if (!this.analyticsEnabled || !this.gtag) return
    
    this.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }

  // Rastrear produtos visualizados
  trackProductView(product) {
    if (!this.analyticsEnabled || !this.gtag) return
    
    this.gtag('event', 'view_item', {
      event_category: 'ecommerce',
      currency: 'BRL',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        category: product.category,
        price: product.price
      }]
    })
  }

  // Rastrear busca
  trackSearch(searchTerm) {
    if (!this.analyticsEnabled || !this.gtag) return
    
    this.gtag('event', 'search', {
      event_category: 'engagement',
      search_term: searchTerm
    })
  }
}

// Service Worker registration
export class ServiceWorkerService {
  constructor() {
    this.isProduction = import.meta.env.VITE_NODE_ENV === 'production'
    this.swEnabled = import.meta.env.VITE_ENABLE_SERVICE_WORKER === 'true'
  }

  async register() {
    if (!this.isProduction || !this.swEnabled || !('serviceWorker' in navigator)) {
      return
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('Service Worker registrado:', registration.scope)

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nova versão disponível
            this.showUpdateAvailable()
          }
        })
      })

      // Escutar mensagens do service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('Cache atualizado pelo Service Worker')
        }
      })

    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error)
    }
  }

  showUpdateAvailable() {
    // Mostrar notificação de atualização disponível
    if (window.confirm('Uma nova versão está disponível. Deseja atualizar?')) {
      window.location.reload()
    }
  }
}

// Singleton instances
export const analytics = new AnalyticsService()
export const serviceWorker = new ServiceWorkerService()

// Auto-registrar service worker
if (typeof window !== 'undefined') {
  serviceWorker.register()
}
