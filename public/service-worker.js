// ================================
// ADVANCED PWA SERVICE WORKER
// ================================

const CACHE_NAME = "pwa-cache-v3";
const STATIC_CACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png"
];

// Install SW
self.addEventListener("install", (event) => {
  console.log("[SW] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Precaching static assets");
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate SW
self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[SW] Deleting old cache", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Cache-first for static files + network fallback
self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith("http")) return;

  // Handle API caching (stale-while-revalidate)
  if (event.request.url.includes("/api/")) {
    event.respondWith(apiCacheStrategy(event.request));
    return;
  }

  // Static caching for HTML/CSS/JS/Images
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() =>
          caches.match("/offline.html")
        )
      );
    })
  );
});

// API cache (stale-while-revalidate strategy)
async function apiCacheStrategy(request) {
  const cache = await caches.open("api-cache");
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then((response) => {
      if (response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkFetch;
}

// Background Sync (for offline POST requests)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-api-data") {
    console.log("[SW] Background sync triggered");
    event.waitUntil(sendQueuedRequests());
  }
});

// (Optional) Background sync queue logic
async function sendQueuedRequests() {
  // Implement queue logic here if needed
}
