const CACHE_NAME = 'EF-EMOJIFARM';
const toCache = [
    '/',
    '/emojifarm/',
    '/emojifarm/icon.png',
    '/emojifarm/music/',
    '/emojifarm/font/',
    '/emojifarm/assets/js/web.webmanifest',
    '/emojifarm/assets/js/register.js',
    '/emojifarm/assets/img/icon.png',
    '/emojifarm/index.html',
    '/emojifarm/dist/main.js',
    '/emojifarm/dist/main.css',
    '/emojifarm/dist/decor.css',
    '/emojifarm/dist/matter.min.js',
    '/emojifarm/font/Delius.ttf',
    '/emojifarm/font/twemoji.ttf',
    '/emojifarm/font/NotoColorEmoji.ttf',
    '/emojifarm/music/tap.wav',
    '/emojifarm/music/levelup.wav',
    '/emojifarm/music/match.wav',
    '/emojifarm/music/done.wav',
    '/emojifarm/music/growth.wav',
    '/emojifarm/music/CozyGardenSerenity.mp3',
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
