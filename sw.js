const staticCacheName = 'restaurant-static-v1'

self.addEventListener('install', (event) => {
  const urlsToCache = [
    '/',
    // '/restaurant.html',
    'main.js',
    // 'retaurantInfo.js',
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
          // We cache everything we are requesting and haven't cached yet
          const dataToCache = response.clone()
          caches.open(staticCacheName).then((cache) => {
            return cache.put(event.request, dataToCache)
          })
          return response
        })
    }).catch(error => {
      console.log('error matching:', error)
    })
  )
})
