const CACHE_NAME = 'yamate-v40-20250929';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('script.google.com') || e.request.url.includes('googleapis.com') || e.request.url.includes('gstatic.com') || e.request.url.includes('cdn.tailwindcss.com') || e.request.url.includes('cdnjs.cloudflare.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).then((fetchRes) => {
        return fetchRes;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
