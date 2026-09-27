const CACHE_NAME = 'biblioteca-v2';

const ARCHIVOS_A_GUARDAR = [
  '/',
  '/manifest.json',
  '/offline'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando y guardando archivos en caché...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ARCHIVOS_A_GUARDAR);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activado');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Service Worker: Borrando caché antigua', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline');
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((respuestaEnCache) => {
        return respuestaEnCache || fetch(event.request);
      })
    );
  }
});