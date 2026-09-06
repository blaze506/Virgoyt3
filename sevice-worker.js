const CACHE_NAME = "virgoyt-community-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json"
];


// INSTALL
self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );

});


// ACTIVATE
self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(cacheNames => {

      return Promise.all(

        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))

      );

    }).then(() => self.clients.claim())

  );

});


// FETCH
self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(

    caches.match(event.request)
      .then(cachedResponse => {

        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(networkResponse => {

            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type === "opaque"
            ) {
              return networkResponse;
            }

            const responseToCache =
              networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(
                  event.request,
                  responseToCache
                );
              });

            return networkResponse;

          });

      })
      .catch(() => {

        return caches.match("./index.html");

      })

  );

});
