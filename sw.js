/* Encomendas do Condomínio — cache offline v5.0.0 */
const CACHE_NAME = 'encomendas-condominio-v5-20261015';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('encomendas-condominio-') && key!==CACHE_NAME).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET' || new URL(event.request.url).origin!==self.location.origin) return;
  if(event.request.mode === 'navigate'){
    event.respondWith(fetch(event.request).then(res=>{
      if(res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));}
      return res;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(res=>{
    if(res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));}
    return res;
  })));
});
