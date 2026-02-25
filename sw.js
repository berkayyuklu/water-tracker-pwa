const cacheName = 'aqua-track-v2';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Yükleme sırasında dosyaları önbelleğe al
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Çevrimdışı desteği için dosyaları getir
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
