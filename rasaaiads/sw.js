// RASAAI Service Worker
const CACHE_NAME = 'rasaai-v2-cache-v1';
const ASSETS_TO_CACHE = [
    '/rasaaiads/',
    '/rasaaiads/index.html',
    '/rasaaiads/styles.css',
    '/rasaaiads/app.js',
    '/rasaaiads/data.js',
    '/rasaaiads/components.js',
    '/rasaaiads/calculator.js',
    '/rasaaiads/maps.js',
    '/rasaaiads/dashboard.js',
    '/rasaaiads/animations.js',
    '/rasaaiads/manifest.json'
];

// Install event - cache all assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached response if found
                if (cachedResponse) {
                    // Fetch fresh version in background
                    fetch(event.request).then((response) => {
                        if (response.status === 200) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, response.clone());
                            });
                        }
                    }).catch(() => {});
                    
                    return cachedResponse;
                }
                
                // Network request with offline fallback
                return fetch(event.request)
                    .then((response) => {
                        if (!response || response.status !== 200) {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                        
                        return response;
                    })
                    .catch(() => {
                        // Offline fallback
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/rasaaiads/index.html');
                        }
                    });
            })
    );
});

// Push notification
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update from RASAAI!',
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🛺</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🛺</text></svg>',
        vibrate: [200, 100, 200],
        tag: 'rasaai-notification',
        requireInteraction: false
    };
    
    event.waitUntil(
        self.registration.showNotification('RASAAI Ads', options)
    );
});
