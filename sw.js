const CACHE_NAME = 'zyosys-v2';
const ASSETS_CORE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/js/config.js'
];

const ASSETS_EXTERNAL = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js'
];

self.addEventListener('install', (event) => {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Cache core assets
                return cache.addAll(ASSETS_CORE);
            })
            // Attempt to cache external assets, but don't fail if they fail (e.g. offline)
            .then(() => {
                const cacheExternal = async () => {
                    const cache = await caches.open(CACHE_NAME);
                    // We map these to catch individual failures so one failure doesn't stop the rest
                    await Promise.all(ASSETS_EXTERNAL.map(url =>
                        cache.add(url).catch(err => console.warn('Failed to cache external:', url))
                    ));
                };
                return cacheExternal();
            })
    );
});

self.addEventListener('activate', (event) => {
    // Clean up old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Take control immediately
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Stale-While-Revalidate Strategy
    // 1. Return from cache immediately if available
    // 2. Fetch from network and update cache in background
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request)
                    .then((networkResponse) => {
                        // Check if we received a valid response
                        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    })
                    .catch((err) => {
                        // Network failed, nothing to do here as we (hopefully) have cached response
                        // or we will return undefined if both fail
                    });

                return cachedResponse || fetchPromise;
            });
        })
    );
});