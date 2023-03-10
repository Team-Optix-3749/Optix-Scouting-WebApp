const staticWebsite = "scouting-site-v1"
const assets = [
  "index.html",
  "nav.html",
  "heatmap.html",
  "files.html",
  "table.html",
  "css/bootstrap.min.css",
  "css/nav.css",
  "css/table.css",
  "js/bootstrap.bundle.min.js",
  "js/files.js",
  "js/heatmap.js",
  "js/html5-qrcode.min.js",
  "js/index.js",
  "js/nav.js",
  "js/table.js",
  "optix.png",
  "manifest.json"
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
        console.log(res, fetchEvent.request.mode)
        return res || fetch(fetchEvent.request)
      })
    )
  })
