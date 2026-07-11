const CACHE_NAME = "QURANBUKU-v3";
const BASE = self.location.pathname.replace(/service-worker\.js$/, "");
const INDEX_URL = BASE + "index.html";

const toCache = [
  BASE,
  INDEX_URL,
  BASE + "book.html",
  BASE + "privacy-policy.html",
  BASE + "manifest.webmanifest",
  BASE + "assets/js/register.js",
  BASE + "qibla/index.html",
  BASE + "qibla/compass.png",
  BASE + "dist/css/imageker.css",
  BASE + "dist/css/main.css",
  BASE + "dist/font/Arabic.ttf",
  BASE + "dist/font/Poppins-Regular.ttf",
  BASE + "dist/font/sura_names.woff2",
  BASE + "dist/js/awake.js",
  BASE + "dist/js/html2canvas.js",
  BASE + "dist/js/imageker.js",
  BASE + "dist/js/laconv.js",
  BASE + "dist/js/main.js",
  BASE + "dist/js/tajweed.js",
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
  if (!reqUrl.pathname.startsWith(BASE)) return;

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
            return caches.match(INDEX_URL);
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
