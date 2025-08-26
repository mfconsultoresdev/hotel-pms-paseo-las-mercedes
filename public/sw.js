const CACHE_NAME = 'hotel-pms-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Archivos estáticos para cache
const STATIC_FILES = [
  '/',
  '/dashboard',
  '/reservations',
  '/guests',
  '/rooms',
  '/payments',
  '/inventory',
  '/reports',
  '/settings',
  '/manifest.json',
  '/offline.html'
];

// Archivos de assets para cache
const ASSET_FILES = [
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return caches.open(DYNAMIC_CACHE);
      })
      .then((cache) => {
        console.log('Service Worker: Dynamic cache created');
        return cache.addAll(ASSET_FILES);
      })
      .then(() => {
        console.log('Service Worker: Assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error during installation:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Interceptar requests de red
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estrategia de cache para diferentes tipos de requests
  if (request.method === 'GET') {
    // Cache first para archivos estáticos
    if (STATIC_FILES.includes(url.pathname) || ASSET_FILES.includes(url.pathname)) {
      event.respondWith(cacheFirst(request));
    }
    // Network first para API calls
    else if (url.pathname.startsWith('/api/')) {
      event.respondWith(networkFirst(request));
    }
    // Stale while revalidate para páginas HTML
    else if (request.headers.get('accept')?.includes('text/html')) {
      event.respondWith(staleWhileRevalidate(request));
    }
    // Cache first para otros recursos
    else {
      event.respondWith(cacheFirst(request));
    }
  }
});

// Estrategia: Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache First strategy failed:', error);
    return getOfflineResponse();
  }
}

// Estrategia: Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Network First strategy failed:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return getOfflineResponse();
  }
}

// Estrategia: Stale While Revalidate
async function staleWhileRevalidate(request) {
  try {
    const cachedResponse = await caches.match(request);
    const fetchPromise = fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    });

    if (cachedResponse) {
      return cachedResponse;
    }
    
    return fetchPromise;
  } catch (error) {
    console.error('Stale While Revalidate strategy failed:', error);
    return getOfflineResponse();
  }
}

// Respuesta offline
function getOfflineResponse() {
  return new Response(
    `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sin Conexión - Hotel PMS</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }
        .offline-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          max-width: 400px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .offline-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        h1 {
          margin: 0 0 20px 0;
          font-size: 24px;
          font-weight: 600;
        }
        p {
          margin: 0 0 30px 0;
          opacity: 0.9;
          line-height: 1.6;
        }
        .retry-button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        .retry-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">📶</div>
        <h1>Sin Conexión</h1>
        <p>No se puede conectar al servidor. Verifica tu conexión a internet e intenta nuevamente.</p>
        <button class="retry-button" onclick="window.location.reload()">
          Reintentar
        </button>
      </div>
    </body>
    </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

// Manejo de push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nueva notificación del Hotel PMS',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      tag: data.tag || 'default'
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Hotel PMS', options)
    );
  }
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action) {
    // Manejar acciones específicas de la notificación
    console.log('Action clicked:', event.action);
  } else {
    // Comportamiento por defecto: abrir la aplicación
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Manejo de sincronización en background
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

// Función para sincronización en background
async function performBackgroundSync() {
  try {
    // Aquí se pueden implementar tareas de sincronización
    // como enviar datos offline, sincronizar cache, etc.
    console.log('Performing background sync...');
    
    // Ejemplo: sincronizar datos offline
    const offlineData = await getOfflineData();
    if (offlineData.length > 0) {
      await syncOfflineData(offlineData);
    }
    
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Función para obtener datos offline (ejemplo)
async function getOfflineData() {
  // Implementar lógica para obtener datos almacenados offline
  return [];
}

// Función para sincronizar datos offline (ejemplo)
async function syncOfflineData(data) {
  // Implementar lógica para sincronizar datos con el servidor
  console.log('Syncing offline data:', data);
}

// Manejo de mensajes del cliente
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('Service Worker: Loaded successfully');

