// Service Worker - ZASA Kitchen Studio v4.0 Ultra-Optimized
const CACHE_NAME = 'zasa-kitchen-v4';
const STATIC_CACHE_NAME = 'zasa-static-v4';
const DYNAMIC_CACHE_NAME = 'zasa-dynamic-v4';

// Assets críticos para LCP
const CRITICAL_ASSETS = [
  '/',
  '/css/style.optimized.min.css',
  '/css/mobile-premium.optimized.min.css', 
  '/js/app.optimized.min.js',
  '/img/logo-zasa.jpg',
  '/assets/hero/culiacan-hero-1200.webp',
  '/assets/hero/culiacan-hero-480.webp',
  '/assets/hero/culiacan-hero-800.webp',
  '/favicon.ico'
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

// Install event - cache crítico para LCP
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching critical LCP assets');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        console.log('[SW] Critical assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Failed to cache critical assets:', error);
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

  if (isDynamicAsset || CRITICAL_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            // Serve from cache and update in background
            fetch(event.request)
              .then(fetchResponse => {
                if (fetchResponse.ok) {
                  const cacheName = CRITICAL_ASSETS.includes(url.pathname) 
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
                const cacheName = CRITICAL_ASSETS.includes(url.pathname) 
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