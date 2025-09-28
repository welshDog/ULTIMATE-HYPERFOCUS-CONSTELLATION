/**
 * 🔧 Service Worker for Ultimate Hyperfocus Constellation
 * Provides offline functionality, caching, and performance optimization
 */

const CACHE_NAME = 'hyperfocus-constellation-v1.2.0';
const STATIC_CACHE = 'static-v1.2.0';
const DYNAMIC_CACHE = 'dynamic-v1.2.0';
const GITHUB_API_CACHE = 'github-api-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/ULTIMATE-HYPERFOCUS-CONSTELLATION/',
    '/ULTIMATE-HYPERFOCUS-CONSTELLATION/index.html',
    '/ULTIMATE-HYPERFOCUS-CONSTELLATION/ultimate_hyperfocus_constellation.js',
    '/ULTIMATE-HYPERFOCUS-CONSTELLATION/github-api-manager.js',
    '/ULTIMATE-HYPERFOCUS-CONSTELLATION/research-mode-manager.js',
    '/ULTIMATE-HYPERFOCUS-CONSTELLATION/onboarding-manager.js',
    '/ULTIMATE-HYPERFOCUS-CONSTELLATION/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

// Files that should always be fetched fresh
const NETWORK_FIRST = [
    'https://api.github.com'
];

// Files that can be served from cache first
const CACHE_FIRST = [
    'https://cdnjs.cloudflare.com',
    '/ULTIMATE-HYPERFOCUS-CONSTELLATION/icons/',
    '/ULTIMATE-HYPERFOCUS-CONSTELLATION/screenshots/'
];

/**
 * Service Worker Installation
 */
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');

    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then((cache) => {
                console.log('📦 Caching static files');
                return cache.addAll(STATIC_FILES);
            }),
            self.skipWaiting() // Activate immediately
        ])
    );
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', (event) => {
    console.log('⚡ Service Worker activating...');

    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== GITHUB_API_CACHE) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            self.clients.claim() // Take control immediately
        ])
    );

    // Notify all clients about the activation
    self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage({
                type: 'SW_ACTIVATED',
                message: 'Service Worker activated - offline functionality ready!'
            });
        });
    });
});

/**
 * Fetch Event Handler - Main request interception
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Handle different types of requests
    if (isGitHubAPIRequest(url)) {
        event.respondWith(handleGitHubAPI(request));
    } else if (isStaticAsset(url)) {
        event.respondWith(handleStaticAsset(request));
    } else if (isCDNRequest(url)) {
        event.respondWith(handleCDNRequest(request));
    } else if (isAppRequest(url)) {
        event.respondWith(handleAppRequest(request));
    } else {
        event.respondWith(handleGenericRequest(request));
    }
});

/**
 * Handle GitHub API requests with intelligent caching
 */
async function handleGitHubAPI(request) {
    const cache = await caches.open(GITHUB_API_CACHE);
    const cacheKey = request.url;

    try {
        // Try to fetch fresh data
        const response = await fetch(request);

        if (response.ok) {
            // Cache successful responses for 5 minutes
            const responseClone = response.clone();
            const cacheResponse = new Response(responseClone.body, {
                status: responseClone.status,
                statusText: responseClone.statusText,
                headers: {
                    ...Object.fromEntries(responseClone.headers.entries()),
                    'sw-cached-at': Date.now().toString(),
                    'sw-cache-expires': (Date.now() + 5 * 60 * 1000).toString() // 5 minutes
                }
            });

            cache.put(cacheKey, cacheResponse);
            return response;
        } else {
            throw new Error(`API responded with ${response.status}`);
        }
    } catch (error) {
        console.log('🔄 Network failed, trying cache for:', request.url);

        // Try cache as fallback
        const cachedResponse = await cache.match(cacheKey);

        if (cachedResponse) {
            const cacheExpires = cachedResponse.headers.get('sw-cache-expires');

            if (cacheExpires && Date.now() < parseInt(cacheExpires)) {
                console.log('📦 Serving cached API response');
                return cachedResponse;
            } else {
                console.log('⏰ Cached API response expired');
            }
        }

        // Return offline response
        return new Response(
            JSON.stringify({
                error: 'Offline',
                message: 'GitHub API unavailable offline. Cached data may be shown.',
                offline: true
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

/**
 * Handle static assets (cache first)
 */
async function handleStaticAsset(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        console.log('📦 Serving cached static asset:', request.url);
        return cachedResponse;
    }

    try {
        const response = await fetch(request);

        if (response.ok) {
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.log('❌ Failed to fetch static asset:', request.url);
        return new Response('Asset unavailable offline', { status: 404 });
    }
}

/**
 * Handle CDN requests (cache first with long expiry)
 */
async function handleCDNRequest(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        console.log('📦 Serving cached CDN asset:', request.url);

        // Optionally fetch fresh version in background
        fetch(request).then((response) => {
            if (response.ok) {
                cache.put(request, response.clone());
            }
        }).catch(() => {
            // Ignore background fetch errors
        });

        return cachedResponse;
    }

    try {
        const response = await fetch(request);

        if (response.ok) {
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.log('❌ Failed to fetch CDN asset:', request.url);
        return new Response('CDN asset unavailable offline', { status: 404 });
    }
}

/**
 * Handle app requests (always serve app shell)
 */
async function handleAppRequest(request) {
    const cache = await caches.open(STATIC_CACHE);

    // Always try to serve the main app shell
    const appShell = await cache.match('/ULTIMATE-HYPERFOCUS-CONSTELLATION/index.html');

    if (appShell) {
        console.log('📦 Serving app shell from cache');
        return appShell;
    }

    // Fallback to network
    try {
        const response = await fetch('/ULTIMATE-HYPERFOCUS-CONSTELLATION/index.html');

        if (response.ok) {
            cache.put('/ULTIMATE-HYPERFOCUS-CONSTELLATION/index.html', response.clone());
        }

        return response;
    } catch (error) {
        // Fallback offline page
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Offline - Hyperfocus Constellation</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: system-ui, sans-serif;
                        background: #0a0a0f;
                        color: #ffffff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        text-align: center;
                    }
                    .offline-container {
                        max-width: 400px;
                        padding: 2rem;
                    }
                    .constellation-icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                        display: block;
                    }
                    h1 { color: #00d9ff; margin-bottom: 1rem; }
                    p { line-height: 1.6; margin-bottom: 1rem; }
                    .retry-btn {
                        background: #00d9ff;
                        color: #0a0a0f;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        margin-top: 1rem;
                    }
                </style>
            </head>
            <body>
                <div class="offline-container">
                    <span class="constellation-icon">🌌</span>
                    <h1>You're Offline</h1>
                    <p>The constellation is currently unavailable. Check your internet connection and try again.</p>
                    <p>Some cached content may still be available.</p>
                    <button class="retry-btn" onclick="window.location.reload()">Retry</button>
                </div>
            </body>
            </html>
        `, {
            status: 200,
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

/**
 * Handle generic requests
 */
async function handleGenericRequest(request) {
    const cache = await caches.open(DYNAMIC_CACHE);

    try {
        const response = await fetch(request);

        if (response.ok) {
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        return new Response('Resource unavailable offline', { status: 404 });
    }
}

/**
 * Utility functions for request classification
 */
function isGitHubAPIRequest(url) {
    return url.hostname === 'api.github.com';
}

function isStaticAsset(url) {
    return url.pathname.includes('/ULTIMATE-HYPERFOCUS-CONSTELLATION/') && 
           (url.pathname.endsWith('.js') || 
            url.pathname.endsWith('.css') || 
            url.pathname.endsWith('.json') ||
            url.pathname.includes('/icons/') ||
            url.pathname.includes('/screenshots/'));
}

function isCDNRequest(url) {
    return CACHE_FIRST.some(domain => url.href.includes(domain));
}

function isAppRequest(url) {
    return url.pathname === '/ULTIMATE-HYPERFOCUS-CONSTELLATION/' ||
           url.pathname === '/ULTIMATE-HYPERFOCUS-CONSTELLATION/index.html' ||
           url.pathname.includes('/ULTIMATE-HYPERFOCUS-CONSTELLATION') && 
           !url.pathname.includes('.');
}

/**
 * Background Sync for when connection is restored
 */
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);

    if (event.tag === 'github-data-sync') {
        event.waitUntil(syncGitHubData());
    } else if (event.tag === 'analytics-sync') {
        event.waitUntil(syncAnalytics());
    }
});

/**
 * Sync GitHub data when connection is restored
 */
async function syncGitHubData() {
    try {
        console.log('🔄 Syncing GitHub data...');

        // Clear old GitHub API cache
        const cache = await caches.open(GITHUB_API_CACHE);
        const keys = await cache.keys();

        await Promise.all(keys.map(key => cache.delete(key)));

        // Notify the app to refresh data
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'GITHUB_DATA_SYNCED',
                message: 'GitHub data refreshed from network'
            });
        });

        console.log('✅ GitHub data sync completed');
    } catch (error) {
        console.error('❌ GitHub data sync failed:', error);
    }
}

/**
 * Sync analytics data when connection is restored
 */
async function syncAnalytics() {
    try {
        // Get queued analytics events from IndexedDB
        // This would integrate with your analytics system
        console.log('📊 Syncing analytics data...');

        // Implementation would depend on analytics provider
        // For now, just log the sync attempt
        console.log('✅ Analytics sync completed');
    } catch (error) {
        console.error('❌ Analytics sync failed:', error);
    }
}

/**
 * Push notification handling
 */
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();

    const options = {
        body: data.body || 'New update available in your constellation!',
        icon: '/ULTIMATE-HYPERFOCUS-CONSTELLATION/icons/icon-192x192.png',
        badge: '/ULTIMATE-HYPERFOCUS-CONSTELLATION/icons/badge-96x96.png',
        tag: data.tag || 'constellation-update',
        requireInteraction: data.requireInteraction || false,
        actions: [
            {
                action: 'open',
                title: 'Open Constellation',
                icon: '/ULTIMATE-HYPERFOCUS-CONSTELLATION/icons/open-action.png'
            },
            {
                action: 'focus',
                title: 'Start Focus Session',
                icon: '/ULTIMATE-HYPERFOCUS-CONSTELLATION/icons/focus-action.png'
            }
        ],
        data: {
            url: data.url || '/ULTIMATE-HYPERFOCUS-CONSTELLATION/',
            action: data.action
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Hyperfocus Constellation', options)
    );
});

/**
 * Notification click handling
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const action = event.action;
    const data = event.notification.data;

    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clients) => {
            // Check if app is already open
            const existingClient = clients.find(client => 
                client.url.includes('ULTIMATE-HYPERFOCUS-CONSTELLATION')
            );

            if (existingClient) {
                // Focus existing window and send action
                existingClient.focus();
                existingClient.postMessage({
                    type: 'NOTIFICATION_ACTION',
                    action: action || 'open',
                    data: data
                });
            } else {
                // Open new window
                let url = data?.url || '/ULTIMATE-HYPERFOCUS-CONSTELLATION/';

                if (action === 'focus') {
                    url += '?action=focus';
                } else if (action === 'research') {
                    url += '?action=research';
                }

                self.clients.openWindow(url);
            }
        })
    );
});

/**
 * Message handling from the main app
 */
self.addEventListener('message', (event) => {
    const { type, data } = event.data;

    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;

        case 'REGISTER_SYNC':
            // Register background sync
            self.registration.sync.register(data.tag);
            break;

        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;

        case 'CACHE_STATUS':
            getCacheStatus().then((status) => {
                event.ports[0].postMessage(status);
            });
            break;
    }
});

/**
 * Clear all caches
 */
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('🗑️ All caches cleared');
}

/**
 * Get cache status information
 */
async function getCacheStatus() {
    const cacheNames = await caches.keys();
    const status = {};

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        status[cacheName] = {
            count: keys.length,
            size: 'Unknown' // Would need to calculate actual size
        };
    }

    return {
        caches: status,
        totalCaches: cacheNames.length
    };
}

/**
 * Periodic cache cleanup
 */
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'cache-cleanup') {
        event.waitUntil(performCacheCleanup());
    }
});

/**
 * Clean up old cache entries
 */
async function performCacheCleanup() {
    console.log('🧹 Performing cache cleanup...');

    const cache = await caches.open(GITHUB_API_CACHE);
    const keys = await cache.keys();

    for (const request of keys) {
        const response = await cache.match(request);
        const cacheExpires = response.headers.get('sw-cache-expires');

        if (cacheExpires && Date.now() > parseInt(cacheExpires)) {
            await cache.delete(request);
            console.log('🗑️ Cleaned expired cache entry:', request.url);
        }
    }

    console.log('✅ Cache cleanup completed');
}

console.log('🔧 Service Worker script loaded');
