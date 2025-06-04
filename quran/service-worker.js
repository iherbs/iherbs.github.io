const CACHE_NAME = 'QURANBUKU';
const toCache = [
    '/',
    '/quran/',
    '/quran/assets/js/web.webmanifest',
    '/quran/assets/js/register.js',
    '/quran/assets/img/icon.png',
    '/quran/icon.png',
    '/quran/index.html',
    '/quran/book.html',
    '/quran/service-worker.js',
    '/quran/qibla/index.html',
    '/quran/qibla/compass.png',
    '/quran/dist/css/imageker.css',
    '/quran/dist/css/main.css',
    '/quran/dist/font/Arabic.ttf',
    '/quran/dist/font/Poppins-Regular.ttf',
    '/quran/dist/font/sura_names.woff2',
    '/quran/dist/js/awake.js',
    '/quran/dist/js/html2canvas.js',
    '/quran/dist/js/imageker.js',
    '/quran/dist/js/laconv.js',
    '/quran/dist/js/main.js',
    '/quran/dist/js/tajweed.js',
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
