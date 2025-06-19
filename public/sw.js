// バージョンを更新すると古いキャッシュが削除される
const CACHE_VERSION = 'v4';
const CACHE_NAME = `learning-app-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

// キャッシュするファイル
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  // 音声ファイル
  '/sounds/effects/correct.mp3',
  '/sounds/effects/incorrect.mp3',
  '/sounds/effects/complete.mp3',
];

// 数字音声ファイルのパスを生成
const NUMBER_SOUNDS = Array.from({ length: 30 }, (_, i) => 
  `/sounds/numbers/${i + 1}.mp3`
);

const CACHE_FILES = [...STATIC_FILES, ...NUMBER_SOUNDS];

// インストール時
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Pre-caching static files');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// アクティベート時
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            // 現在のバージョン以外のキャッシュをすべて削除
            if (!key.includes(CACHE_VERSION)) {
              console.log('Removing old cache:', key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// フェッチイベント（オフライン対応）
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 音声ファイルの場合（常にネットワークから取得）
  if (url.pathname.includes('/sounds/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 音声ファイルはキャッシュしない（iOS Safari対策）
          return response;
        })
        .catch(() => {
          // オフライン時のみキャッシュから取得
          return caches.match(request)
            .then((response) => {
              if (response) {
                console.log('Serving audio from cache:', url.pathname);
                return response;
              }
              console.log('Audio file not available:', url.pathname);
              return new Response('Audio not available', { status: 404 });
            });
        })
    );
    return;
  }

  // HTMLページの場合（常に最新を取得）
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 成功したら新しいHTMLをキャッシュに保存
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // オフライン時はキャッシュから返す
          return caches.match(request)
            .then((response) => response || caches.match('/index.html'));
        })
    );
    return;
  }

  // JSやCSSファイルの場合（ネットワーク優先）
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 成功したら新しいファイルをキャッシュに保存
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // オフライン時はキャッシュから返す
          return caches.match(request);
        })
    );
    return;
  }

  // その他のリソース（キャッシュ優先）
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(request)
          .then((fetchResponse) => {
            // 成功した場合はキャッシュに保存
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return fetchResponse;
          });
      })
  );
});

// プッシュ通知（将来的な拡張用）
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// 通知クリック時
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});