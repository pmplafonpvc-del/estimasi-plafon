// Naikkan versi ini setiap kali file aplikasi diubah
const CACHE = 'plafon-pvc-v8';
const FILES = ['./', './index.html', './manifest.webmanifest', './logo.png', './logo.js', './icon-192.png', './icon-512.png',
  './lib/jspdf.umd.min.js', './lib/jspdf.plugin.autotable.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Saat online selalu ambil versi terbaru (lalu simpan), saat offline pakai simpanan
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request, {ignoreSearch: true})));
});
