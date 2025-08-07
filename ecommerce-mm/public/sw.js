const CACHE_NAME = 'menina-mulher-v1'
const STATIC_CACHE = 'static-cache-v1'
const DYNAMIC_CACHE = 'dynamic-cache-v1'

// Arquivos para cache estático
const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/logo.jpg',
  '/favicon.ico',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
]

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Cache aberto')
        return cache.addAll(STATIC_FILES)
      })
      .catch((err) => console.log('Service Worker: Erro ao fazer cache', err))
  )
})

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativado')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
            console.log('Service Worker: Limpando cache antigo', cache)
            return caches.delete(cache)
          }
        })
      )
    })
  )
})

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  // Cache-first strategy para assets estáticos
  if (event.request.url.includes('/assets/') || 
      event.request.url.includes('fonts.googleapis.com') ||
      event.request.destination === 'image') {
    
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then((fetchRes) => {
              return caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(event.request.url, fetchRes.clone())
                  return fetchRes
                })
            })
        })
        .catch(() => {
          // Fallback para imagens offline
          if (event.request.destination === 'image') {
            return caches.match('/assets/offline-image.png')
          }
        })
    )
  }
  // Network-first strategy para API calls
  else if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseClone)
              })
          }
          return response
        })
        .catch(() => {
          return caches.match(event.request)
        })
    )
  }
  // Cache-first para navegação
  else if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html')
        .then((response) => {
          return response || fetch(event.request)
        })
    )
  }
})

// Sync em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync')
    event.waitUntil(
      // Implementar sync de dados quando voltar online
      syncData()
    )
  }
})

async function syncData() {
  try {
    // Implementar sincronização de dados offline
    console.log('Sincronizando dados...')
  } catch (error) {
    console.error('Erro na sincronização:', error)
  }
}
