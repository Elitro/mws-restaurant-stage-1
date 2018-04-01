const staticCacheName = 'restaurant-static-v1'

self.addEventListener('install', (event) => {
  const urlsToCache = [
    '/',
    'main.js',
    'data/restaurants.json',
    'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2'
  ]

  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
        .then(response => {
          // if it's a picture, we cache it
          const imgData = response.clone()
          if (imgData.url.match(/.*\.jpg/)) {
            caches.open(staticCacheName).then((cache) => {
              return cache.put(event.request, imgData)
            })
          }
          return response
        })
    }).catch(error => {
      console.log('error matching:', error)
    })
  )
})
