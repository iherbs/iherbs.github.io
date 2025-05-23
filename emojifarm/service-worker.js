const CACHE_NAME = 'EF-EMOJIFARM';
const toCache = [
    '/',
    'assets/js/web.webmanifest',
    'assets/js/register.js',
    'assets/img/icon.png',
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(toCache)
            })
            .then(self.skipWaiting())
    )
})

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                        return cache.match(event.request)
                    })
            })
    )
})

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then((keyList) => {
                return Promise.all(keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[ServiceWorker] Hapus cache lama', key)
                        return caches.delete(key)
                    }
                }))
            })
            .then(() => self.clients.claim())
    )
})
