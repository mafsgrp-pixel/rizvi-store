const CACHE_NAME = 'rasaai-v3.0';
const ASSETS_TO_CACHE = [
  '/rasaai/',
  '/rasaai/index.html',
  '/rasaai/login.html',
  '/rasaai/register.html',
  '/rasaai/dashboard.html',
  '/rasaai/admin.html',
  '/rasaai/client.html',
  '/rasaai/driver.html',
  '/rasaai/affiliate.html',
  '/rasaai/sales.html',
  '/rasaai/campaign.html',
  '/rasaai/invoice.html',
  '/rasaai/analytics.html',
  '/rasaai/crm.html',
  '/rasaai/forgot-password.html',
  '/rasaai/privacy.html',
  '/rasaai/terms.html',
  '/rasaai/refund.html',
  '/rasaai/404.html',
  '/rasaai/style.css',
  '/rasaai/app.js',
  '/rasaai/manifest.json',
  '/rasaai/robots.txt'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('RASAAI SW: Caching', ASSETS_TO_CACHE.length, 'assets');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.log('SW: Some assets failed to cache, continuing...', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match('/rasaai/');
        });
      })
  );
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Your campaign stats have been updated.',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%236C4DF6"/><text x="50" y="68" font-size="55" text-anchor="middle" fill="white" font-weight="bold">R</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%236C4DF6"/></svg>',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/rasaai/dashboard.html' }
  };
  event.waitUntil(self.registration.showNotification(data.title || 'RASAAI Update', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/rasaai/dashboard.html'));
});
