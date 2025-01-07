const CACHE_NAME = 'plank-timer-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://www.soundjay.com/button/beep-07.wav'
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

// サービスワーカーがアクティベートされたとき
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// リクエストをキャッシュから返す
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // キャッシュが見つかればそれを返す
                if (cachedResponse) {
                    return cachedResponse;
                }

                // キャッシュが見つからなければネットワークリクエスト
                return fetch(event.request);
            })
    );
});
