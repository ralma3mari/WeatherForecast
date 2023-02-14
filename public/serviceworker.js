const CACHE_NAME = "version-1";
const urlsToCache = ['index.html','offline.html'];

const self = this;
// Instal a service worker
self.addEventListener('install',(event)=>{
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened Cache');
            return cache.addAll(urlsToCache)
        })

    )
})
// listen
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then(()=>{
            return fetch(event.request)
                .catch(()=> caches.match('offline.html'))
        })
    )
})

// activate
self.addEventListener('activate', (event) => {
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME)

    event.waitUntil(
        caches.keys().then((cacheName)=>Promise.all(
            cacheName.map((cacheName)=>{
                if(!cacheWhiteList.includes(cacheName)){
                    return caches.delete(cacheName)
                }
            }) 
        ))
    )
})