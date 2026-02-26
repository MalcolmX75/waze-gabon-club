// Waze Gabon Club — Service Worker
// Stratégie de cache :
//   - Cache-first pour le shell (index.html), JS bundles, fonts
//   - Network-first pour tout le reste
//   - Pas de cache pour embed.waze.com, waze.com/ul, liens externes
// Version du cache : incrémenter à chaque déploiement significatif

const CACHE_NAME = "waze-gabon-v1";

// Assets à pré-cacher lors de l'installation
const PRECACHE_ASSETS = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// Domaines à ne jamais cacher
const NO_CACHE_DOMAINS = [
  "embed.waze.com",
  "waze.com",
  "apps.apple.com",
  "play.google.com",
  "formspree.io",
];

// --- Install : pré-cacher les assets statiques ---
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)),
  );
  self.skipWaiting();
});

// --- Activate : supprimer les anciens caches ---
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

// --- Fetch : stratégie de cache selon la requête ---
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== "GET") return;

  // Ne jamais cacher certains domaines
  if (NO_CACHE_DOMAINS.some((domain) => url.hostname.includes(domain))) return;

  // Google Fonts : cache-first (polices stables)
  if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // JS/CSS bundles avec hash (immutables) : cache-first
  if (url.pathname.match(/\/assets\/.*\.[a-f0-9]+\.(js|css)$/)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Navigation (HTML) : network-first avec fallback cache
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Tout le reste : network-first
  event.respondWith(networkFirstWithFallback(request));
});

// --- Stratégies ---

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback : retourner le shell pour les requêtes de navigation
    if (request.mode === "navigate") {
      const shell = await caches.match("/");
      if (shell) return shell;
    }

    return new Response("Offline", { status: 503 });
  }
}
