// Define a name for the cache
const CACHE_NAME = 'chronoquest-v1';

// List the files to be cached. This is the "app shell".
const urlsToCache = [
  './',
  './index.html'
];

// 1. Installation
// This event is fired when the service worker is first installed.
self.addEventListener('install', event => {
  // We wait until the installation is complete.
  event.waitUntil(
    // Open the cache.
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all the specified files to the cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Fetch
// This event is fired for every single request the page makes.
self.addEventListener('fetch', event => {
  event.respondWith(
    // Check if the request is already in the cache.
    caches.match(event.request)
      .then(response => {
        // If we found a match in the cache, return it.
        if (response) {
          return response;
        }
        // If not in cache, fetch it from the network.
        return fetch(event.request);
      }
    )
  );
});

// 3. Activation
// This event is fired when the service worker is activated.
// It's a good place to clean up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // If a cache is not in our whitelist, delete it.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});