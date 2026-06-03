const CACHE_NAME = "avpk-helper-v1";
 
const urlsToCache = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/min.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];
 
// При установке Service Worker — сохраняем файлы в кэш
self.addEventListener("install", (event) => {
  console.log("[SW] Установка");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Кэшируем файлы");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});
 
// При активации — удаляем старые версии кэша
self.addEventListener("activate", (event) => {
  console.log("[SW] Активация");
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[SW] Удаляем старый кэш:", name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});
 
// При запросе — отдаём из кэша, если есть, иначе из сети
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;          // нашли в кэше
      }
      return fetch(event.request);  // идём в сеть
    })
  );
});
