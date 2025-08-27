// Service Worker - ZASA Kitchen Studio v2.0
const CACHE_NAME = 'zasa-kitchen-v2';
const STATIC_CACHE_NAME = 'zasa-static-v2';
const DYNAMIC_CACHE_NAME = 'zasa-dynamic-v2';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/css/style.optimized.min.css',
  '/css/mobile-premium.optimized.min.css',
  '/js/app.optimized.min.js',
  '/js/lazy-images.min.js',
  '/img/logo-zasa.webp',
  '/img/optimized/home-hero/foto-principal-1920.webp',
  '/favicon.ico',
  '/site.webmanifest'
];

// Assets to cache on demand
const DYNAMIC_ASSETS_PATTERNS = [
  /\.webp$/,
  /\.jpg$/,
  /\.png$/,
  /\.css$/,
  /\.js$/,
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('zasa-')) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle HTML pages - network first, cache fallback
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(response => {
              return response || caches.match('/');
            });
        })
    );
    return;
  }

  // Handle assets - cache first, network fallback
  const isDynamicAsset = DYNAMIC_ASSETS_PATTERNS.some(pattern => 
    pattern.test(event.request.url)
  );

  if (isDynamicAsset || STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            // Serve from cache and update in background
            fetch(event.request)
              .then(fetchResponse => {
                if (fetchResponse.ok) {
                  const cacheName = STATIC_ASSETS.includes(url.pathname) 
                    ? STATIC_CACHE_NAME 
                    : DYNAMIC_CACHE_NAME;
                  
                  caches.open(cacheName)
                    .then(cache => cache.put(event.request, fetchResponse.clone()));
                }
              })
              .catch(() => {}); // Silently fail background update
            
            return response;
          }
          
          // Not in cache, fetch from network
          return fetch(event.request)
            .then(fetchResponse => {
              if (fetchResponse.ok) {
                const responseClone = fetchResponse.clone();
                const cacheName = STATIC_ASSETS.includes(url.pathname) 
                  ? STATIC_CACHE_NAME 
                  : DYNAMIC_CACHE_NAME;
                
                caches.open(cacheName)
                  .then(cache => cache.put(event.request, responseClone));
              }
              return fetchResponse;
            });
        })
    );
  }
});

// Background sync for analytics
self.addEventListener('sync', event => {
  if (event.tag === 'background-analytics') {
    event.waitUntil(
      // Send queued analytics data when online
      self.registration.sync.register('analytics-sync')
    );
  }
});

// Push notifications (future feature)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nueva actualización de ZASA Kitchen Studio',
      icon: '/img/logo-zasa.webp',
      badge: '/img/logo-zasa.webp',
      data: data.url || '/',
      actions: [
        {
          action: 'open',
          title: 'Ver'
        },
        {
          action: 'close',
          title: 'Cerrar'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'ZASA Kitchen Studio', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});

console.log('[SW] Service Worker registered for ZASA Kitchen Studio');