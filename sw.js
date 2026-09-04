/* Shell only. Never cache APKs — a patch must be the file on the glass. */
const SHELL = "trappstore-shell-v2";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL).then((cache) => cache.addAll(["/", "/catalog.json", "/fonts/fonts.css", "/brand/mark.svg"])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== SHELL).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.endsWith(".apk")) return;
  if (url.pathname.startsWith("/o/")) return;
  if (event.request.method !== "GET") return;
  if (url.pathname.endsWith("catalog.json") || url.pathname.endsWith("manifest.json")) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
});
