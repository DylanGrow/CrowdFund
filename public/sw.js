// Fix 5: Dynamic SW Cache Versioning and cache-busting logic
const CACHE_NAME = 'sec-fund-cache-v1.3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './favicon.svg',
  './manifest.json',
  './robots.txt',
  './sitemap.xml'
];

// Install event: cache initial offline resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event: immediately clear obsolete caches from previous deployments
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting obsolete cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: serve cached content or fetch and cache dynamically
self.addEventListener('fetch', (event) => {
  // Only handle local GET requests
  if (
    event.request.method === 'GET' &&
    event.request.url.startsWith(self.location.origin)
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Caches successful dynamic assets (such as Vite compiled CSS/JS)
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Silently absorb fetch errors when offline
          });

        return cachedResponse || fetchPromise;
      })
    );
  }
});

// Fix 6: Listen for skipWaiting messages from client to reload immediately
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
