/*
 * Filename: service-worker.js
 * Path: /service-worker.js
 * Project: RASAAI - Auto Rickshaw Advertising Network
 * Description: PWA Service Worker - Offline caching, background sync, push notifications
 * Type: Service Worker
 */

// ============================================
// CACHE CONFIGURATION
// ============================================

const CACHE_NAME = 'rasaai-v4.0.0';
const RUNTIME_CACHE = 'rasaai-runtime';

// Assets to cache on install
const PRECACHE_ASSETS = [
    // HTML Pages
    '/rasaai/index.html',
    '/rasaai/pages/login.html',
    '/rasaai/pages/register.html',
    '/rasaai/pages/forgot-password.html',
    '/rasaai/pages/dashboard.html',
    '/rasaai/pages/admin.html',
    '/rasaai/pages/client.html',
    '/rasaai/pages/driver.html',
    '/rasaai/pages/affiliate.html',
    '/rasaai/pages/sales.html',
    '/rasaai/pages/passenger.html',
    '/rasaai/pages/campaign.html',
    '/rasaai/pages/invoice.html',
    '/rasaai/pages/analytics.html',
    '/rasaai/pages/crm.html',
    '/rasaai/pages/scan.html',
    '/rasaai/pages/rewards.html',
    '/rasaai/pages/leaderboard.html',
    '/rasaai/pages/privacy.html',
    '/rasaai/pages/terms.html',
    '/rasaai/pages/refund.html',
    '/rasaai/pages/404.html',
    '/rasaai/pages/offline.html',

    // CSS Files
    '/rasaai/css/main.css',
    '/rasaai/css/layout.css',
    '/rasaai/css/components.css',
    '/rasaai/css/landing.css',
    '/rasaai/css/dashboard.css',
    '/rasaai/css/mobile.css',
    '/rasaai/css/dark-mode.css',
    '/rasaai/css/print.css',
    '/rasaai/css/animations.css',

    // Core JS Files
    '/rasaai/js/core/config.js',
    '/rasaai/js/core/auth.js',
    '/rasaai/js/core/sheets.js',
    '/rasaai/js/core/router.js',
    '/rasaai/js/core/state.js',
    '/rasaai/js/app.js',

    // Data JS Files
    '/rasaai/js/data/constants.js',
    '/rasaai/js/data/zones.js',
    '/rasaai/js/data/templates.js',
    '/rasaai/js/data/demo-users.js',

    // Utility JS Files
    '/rasaai/js/utils/helpers.js',
    '/rasaai/js/utils/validators.js',
    '/rasaai/js/utils/formatters.js',
    '/rasaai/js/utils/error-handler.js',

    // Module JS Files
    '/rasaai/js/modules/pricing.js',
    '/rasaai/js/modules/calculator.js',
    '/rasaai/js/modules/campaigns.js',
    '/rasaai/js/modules/inventory.js',
    '/rasaai/js/modules/invoices.js',
    '/rasaai/js/modules/payments.js',
    '/rasaai/js/modules/crm.js',
    '/rasaai/js/modules/affiliates.js',
    '/rasaai/js/modules/analytics.js',
    '/rasaai/js/modules/charts.js',
    '/rasaai/js/modules/notifications.js',
    '/rasaai/js/modules/audio.js',
    '/rasaai/js/modules/scanner.js',
    '/rasaai/js/modules/gamification.js',

    // Assets
    '/rasaai/assets/images/logo.svg',
    '/rasaai/assets/images/logo-white.svg',
    '/rasaai/assets/images/favicon.ico',
    '/rasaai/manifest.json',

    // External (cached for offline)
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// ============================================
// INSTALL EVENT
// ============================================

self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching precache assets...');
                
                // Cache assets one by one to avoid failing all if one fails
                const cachePromises = PRECACHE_ASSETS.map(asset => {
                    return cache.add(asset).catch(error => {
                        console.warn(`⚠️ Failed to cache: ${asset}`, error);
                    });
                });
                
                return Promise.all(cachePromises);
            })
            .then(() => {
                console.log('✅ Precaching complete');
                return self.skipWaiting();
            })
    );
});

// ============================================
// ACTIVATE EVENT
// ============================================

self.addEventListener('activate', (event) => {
    console.log('🔧 Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Delete old caches
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log(`🗑️ Deleting old cache: ${cacheName}`);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Activation complete');
                return self.clients.claim();
            })
    );
});

// ============================================
// FETCH EVENT (Network First, Cache Fallback)
// ============================================

self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and Google API calls
    if (event.request.method !== 'GET') return;
    
    // Skip Google Sheets API calls (should always go to network)
    if (event.request.url.includes('googleapis.com') || 
        event.request.url.includes('accounts.google.com') ||
        event.request.url.includes('script.google.com')) {
        return;
    }

    event.respondWith(
        networkFirstStrategy(event.request)
    );
});

// ============================================
// NETWORK FIRST STRATEGY
// ============================================

async function networkFirstStrategy(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        // Network failed, try cache
        console.log(`📴 Offline - serving from cache: ${request.url}`);
        
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // If HTML request, return offline page
        if (request.headers.get('Accept')?.includes('text/html')) {
            const offlinePage = await caches.match('/rasaai/pages/offline.html');
            if (offlinePage) return offlinePage;
        }
        
        // Return a simple offline response
        return new Response(
            JSON.stringify({
                error: 'offline',
                message: 'You are offline. Please check your internet connection.',
                timestamp: new Date().toISOString()
            }),
            {
                status: 503,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Offline': 'true'
                }
            }
        );
    }
}

// ============================================
// CACHE FIRST STRATEGY (For static assets)
// ============================================

async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.warn(`⚠️ Offline, no cache for: ${request.url}`);
        throw error;
    }
}

// ============================================
// BACKGROUND SYNC
// ============================================

self.addEventListener('sync', (event) => {
    console.log(`🔄 Background Sync: ${event.tag}`);

    if (event.tag === 'sync-audio-logs') {
        event.waitUntil(syncAudioLogs());
    }
    
    if (event.tag === 'sync-scan-logs') {
        event.waitUntil(syncScanLogs());
    }
    
    if (event.tag === 'sync-pending-operations') {
        event.waitUntil(syncPendingOperations());
    }
});

async function syncAudioLogs() {
    console.log('🔄 Syncing audio logs...');
    
    try {
        // Get offline audio logs from IndexedDB
        const db = await openDatabase();
        const logs = await getAllFromStore(db, 'audioLogs');
        
        if (logs.length === 0) {
            console.log('📝 No audio logs to sync');
            return;
        }
        
        // Try to send to server
        for (const log of logs) {
            try {
                const response = await fetch(
                    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/AudioLogs:append?valueInputOption=USER_ENTERED`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ values: [log] })
                    }
                );
                
                if (response.ok) {
                    await deleteFromStore(db, 'audioLogs', log.id);
                }
            } catch (error) {
                console.warn('⚠️ Sync failed for log:', log.id);
                break;
            }
        }
        
        console.log(`✅ Synced audio logs`);
        
    } catch (error) {
        console.error('❌ Audio log sync failed:', error);
    }
}

async function syncScanLogs() {
    console.log('🔄 Syncing scan logs...');
    // Similar to audio logs sync
}

async function syncPendingOperations() {
    console.log('🔄 Syncing pending operations...');
    // Process any pending offline operations
}

// ============================================
// PUSH NOTIFICATIONS
// ============================================

self.addEventListener('push', (event) => {
    console.log('📨 Push notification received');

    let data = {
        title: 'RASAAI',
        body: 'You have a new notification',
        icon: '/rasaai/assets/icons/icon-192x192.png',
        badge: '/rasaai/assets/icons/icon-72x72.png',
        tag: 'rasaai-notification',
        data: {
            url: '/rasaai/pages/dashboard.html'
        }
    };

    if (event.data) {
        try {
            const pushData = event.data.json();
            data = { ...data, ...pushData };
        } catch {
            data.body = event.data.text();
        }
    }

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            badge: data.badge,
            tag: data.tag,
            data: data.data,
            vibrate: [200, 100, 200],
            actions: [
                {
                    action: 'open',
                    title: 'Open'
                },
                {
                    action: 'close',
                    title: 'Dismiss'
                }
            ]
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') return;

    const url = event.notification.data?.url || '/rasaai/index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if there's already an open window
                for (const client of clientList) {
                    if (client.url.includes(url) && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Open new window
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

// ============================================
// INDEXEDDB HELPERS
// ============================================

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('RASAAI_Offline', 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('audioLogs')) {
                db.createObjectStore('audioLogs', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('scanLogs')) {
                db.createObjectStore('scanLogs', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('pendingOperations')) {
                db.createObjectStore('pendingOperations', { keyPath: 'id', autoIncrement: true });
            }
        };
        
        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
}

function getAllFromStore(db, storeName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function deleteFromStore(db, storeName, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// ============================================
// MESSAGE HANDLING
// ============================================

self.addEventListener('message', (event) => {
    console.log('📨 Message received:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(name => caches.delete(name))
                );
            }).then(() => {
                console.log('🗑️ All caches cleared');
            })
        );
    }
});

// ============================================
// LIFECYCLE LOGGING
// ============================================

console.log('✅ RASAAI Service Worker v4.0.0 Loaded');
console.log('📦 CACHE_NAME:', CACHE_NAME);
console.log('📋 Precache Assets:', PRECACHE_ASSETS.length);
