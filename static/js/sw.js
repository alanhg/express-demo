// Installing Service Worker

const CACHE_NAME = 'static_assets_v1';
const urlsToCache = ['/js/xterm/css/xterm.css', '/js/contextMenu.css', '/js/xterm/lib/xterm.js'];

/**
 * install事件一般是被用来填充浏览器的离线缓存能力
 */
self.addEventListener('install', function (event) {
  // Perform install steps
  // event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', () => {

});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');

  // e.waitUntil(
  //   caches.keys().then(function (keyList) {
  //     return Promise.all(keyList.map(function (key) {
  //       if (key !== CACHE_NAME) {
  //         // 清理旧版本
  //         console.log('[ServiceWorker] Removing old cache', key);
  //         return caches.delete(key);
  //       }
  //     }));
  //   })
  // );
  event.waitUntil(async function() {
      // 发送消息到网页
    const allClients = await self.clients.matchAll();
    allClients.forEach(client => {
      client.postMessage({ type: 'service-worker-activated' });
    });
    console.log('[Service Worker] Matching clients:', allClients);
  }());
  // 更新客户端
  return self.clients.claim();
});
