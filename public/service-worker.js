const APP_PREFIX = 'Budget-Tracker';
//chech line 3
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    './index.html',
    './css/styles.css',
    './js/index.js',
    './js/idb.js',
    './manifest.json',
    './icons/icon-512x512.png',
    './icons/icon-384x384.png',
    './icons/icon-192x192.png',
    './icons/icon-152x152.png',
    './icons/icon-144x144.png',
    './icons/icon-128x128.png',
    './icons/icon-96x96.png',
    './icons/icon-72x72.png'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log("🎉 Files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheList.push(CACHE_NAME);

            return Promise.all(
                keyList.map(function (key, i) {
                if (cacheList.indexOf(key) === -1) {
                    console.log('Removing Cache Data: ' + keyList[i] );
                    return caches.delete(keyList[i]);
                }
            }));
        })
    )
});


// Fetch
self.addEventListener('fetch', function (e) {
    console.log('Fetch Request : ' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) { // if response is good, return with cache
                console.log('responding With Cache : ' + e.request.url);
                return request
            } else {       // if there is no response, try fetching request
                console.log('Whoops! File is not cached, fetching : ' + e.request.url);
                return fetch(e.request)
            }

        })
    
    )
});

//  Use "offline-first" approach to implement static assets.
e.respondWith(
    caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
    })
);