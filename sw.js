// Service Worker pour Simulateur Ambulances
const CACHE_NAME = 'ambulance-simulator-v2.0';
const urlsToCache = [
  '/simulateur-ambulance/',
  '/simulateur-ambulance/index.html',
  '/simulateur-ambulance/manifest.json',
  '/simulateur-ambulance/icons/icon-72x72.png',
  '/simulateur-ambulance/icons/icon-96x96.png',
  '/simulateur-ambulance/icons/icon-128x128.png',
  '/simulateur-ambulance/icons/icon-144x144.png',
  '/simulateur-ambulance/icons/icon-152x152.png',
  '/simulateur-ambulance/icons/icon-192x192.png',
  '/simulateur-ambulance/icons/icon-384x384.png',
  '/simulateur-ambulance/icons/icon-512x512.png'
];

// Installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Mise en cache des fichiers');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  // Pour les pages HTML, stratégie "Network First"
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/simulateur-ambulance/index.html');
        })
    );
    return;
  }
  
  // Pour les autres ressources, stratégie "Cache First"
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
