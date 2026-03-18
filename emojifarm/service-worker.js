const CACHE_NAME = "EF-EMOJIFARM";
const toCache = [
  "./",
  "./icon.png",
  "./assets/js/web.webmanifest",
  "./assets/js/register.js",
  "./assets/img/icon.png",
  "./index.html",
  "./dist/peerjs.min.js",
  "./dist/qrcode.min.js",
  "./dist/html5-qrcode.min.js",
  "./dist/matter.min.js",
  "./dist/main.js",
  "./dist/main.css",
  "./dist/decor.css",
  "./dist/livestock.css",
  "./dist/fishing.css",
  "./font/Delius.ttf",
  "./font/twemoji.ttf",
  "./font/NotoColorEmoji.ttf",
  "./font/openmoji.woff2",
  "./music/tap.wav",
  "./music/levelup.wav",
  "./music/match.wav",
  "./music/done.wav",
  "./music/growth.wav",
  "./music/chicken.wav",
  "./music/cook.wav",
  "./music/cow.wav",
  "./music/rodreel.wav",
  "./music/rodwosh.wav",
  "./music/CozyGardenSerenity.mp3",
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
