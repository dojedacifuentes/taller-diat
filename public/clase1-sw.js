/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// Service worker de sala · Taller DIAT
//
// Objetivo acotado: que una caída de wifi durante los 90 minutos no interrumpa
// una actividad de /clase-1 ya visitada. No es una PWA instalable ni precachea
// el sitio completo.
//
// Estrategias:
//   · estáticos inmutables de Next (/_next/static/…) → caché primero
//   · navegaciones de documento            → red primero, caché de respaldo
//   · todo lo demás                        → passthrough
//
// Nunca intercepta métodos distintos de GET ni peticiones a otros orígenes: las
// herramientas de IA externas quedan siempre fuera.
// ─────────────────────────────────────────────────────────────────────────────
// Al cambiar de versión, el 'activate' borra las cachés anteriores. Se sube cuando
// cambia la estructura de rutas de la clase, para que ninguna página de la
// arquitectura retirada sobreviva en el dispositivo de un estudiante.
const VERSION = 'diat-clase1-v2';
const STATIC_CACHE = `${VERSION}-static`;
const PAGES_CACHE = `${VERSION}-pages`;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Estáticos con hash: inmutables, caché primero.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response && response.status === 200) {
          const cache = await caches.open(STATIC_CACHE);
          cache.put(request, response.clone());
        }
        return response;
      })(),
    );
    return;
  }

  // Navegaciones dentro de /clase-1: red primero, caché de respaldo.
  const isClassPage =
    request.mode === 'navigate' && url.pathname.startsWith('/clase-1');
  if (isClassPage) {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response && response.status === 200) {
            const cache = await caches.open(PAGES_CACHE);
            cache.put(request, response.clone());
          }
          return response;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          const root = await caches.match('/clase-1');
          if (root) return root;
          throw new Error('offline');
        }
      })(),
    );
  }
});
