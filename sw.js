// sw.js — Service Worker（オフライン対応）

const CACHE_NAME = 'yondayo-v2';

// キャッシュするアセット
const ASSETS = [
  '/',
  '/index.html',
  '/books.html',
  '/add-book.html',
  '/history.html',
  '/css/style.css',
  '/js/storage.js',
  '/js/books.js',
  '/js/tasks.js',
  '/js/streak.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// インストール時にアセットをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// フェッチ：キャッシュ優先、なければネットワーク
self.addEventListener('fetch', (event) => {
  // GETリクエストのみキャッシュ対象
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // レスポンスが正常な場合はキャッシュに追加
        if (response && response.status === 200 && response.type === 'basic') {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
        }
        return response;
      });
    })
  );
});
