const staticWebsite = "scouting-site-v1"
const assets = [
  "/",
  "/index.html",
  "/files.html",
  "/table.html",
  "/css/table.css",
  "/js/files.js",
  "/js/html5-qrcode.min.js",
  "/js/index.js",
  "/js/table.js",
  "/optix.png",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticWebsite).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })