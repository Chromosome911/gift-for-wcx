const CACHE_NAME = 'tracy-v1';
const URLS = [
    '/',
    '/main.html',
    '/letter.html',
    '/chat.html',
    '/snake.html',
    '/manifest.json',
    '/images/bg.jpg',
    '/images/icon-192.png',
    '/images/icon-512.png',
    '/chat-messages.js',
    '/letter-messages.txt'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(URLS))
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(r => r || fetch(e.request))
    );
});
