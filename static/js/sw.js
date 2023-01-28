// Installing Service Worker

const CACHE_NAME = 'static_assets_v1';
const urlsToCache = ['/js/xterm/css/xterm.css', '/js/contextMenu.css', '/js/xterm/lib/xterm.js'];

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', () => {
});
