const CACHE_NAME = 'zeosys-v2';
const ASSETS_CORE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/js/config.js'
];

// Install: Cache Core Assets
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_CORE))
    );
});

// Activate: Clean Old Caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
});

// Fetch: Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                }).catch(() => cachedResponse); // Fallback to cache if offline

                return cachedResponse || fetchPromise;
            });
        })
    );
});
