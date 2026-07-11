const CACHE_NAME = "QURANBUKU-v2";
const toCache = [
  "./",
  "./index.html",
  "./book.html",
  "./privacy-policy.html",
  "./service-worker.js",
  "./assets/js/web.webmanifest",
  "./assets/js/register.js",
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
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  const reqUrl = new URL(event.request.url);
  if (reqUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request)
        .then(function (response) {
          if (!response || response.status !== 200) return response;
          const clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(function () {
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
          return caches.match(event.request);
        });
    }),
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keyList) {
        return Promise.all(
          keyList.map(function (key) {
            if (key !== CACHE_NAME) {
              console.log("[ServiceWorker] Hapus cache lama", key);
              return caches.delete(key);
            }
          }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});
