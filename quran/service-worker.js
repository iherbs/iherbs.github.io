const CACHE_NAME = "QURANBUKU";
const toCache = [
  "./",
  "./assets/js/web.webmanifest",
  "./assets/js/register.js",
  "./assets/img/icon.png",
  "./icon.png",
  "./index.html",
  "./book.html",
  "./service-worker.js",
  "./qibla/index.html",
  "./qibla/compass.png",
  "./dist/css/imageker.css",
  "./dist/css/main.css",
  "./dist/font/Arabic.ttf",
  "./dist/font/Poppins-Regular.ttf",
  "./dist/font/sura_names.woff2",
  "./dist/js/awake.js",
  "./dist/js/html2canvas.js",
  "./dist/js/imageker.js",
  "./dist/js/laconv.js",
  "./dist/js/main.js",
  "./dist/js/tajweed.js",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(toCache);
      })
      .then(self.skipWaiting()),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request);
      });
    }),
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("[ServiceWorker] Hapus cache lama", key);
              return caches.delete(key);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});
