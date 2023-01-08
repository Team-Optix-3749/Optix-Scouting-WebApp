const staticWebsite = "scouting-site-v1"
const assets = [
  "/",
  "/index.html",
  "/optix.png",
  "/html5-qrcode.min.js",
  "index.js",
  "camera.js"
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