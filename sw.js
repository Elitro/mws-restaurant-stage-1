self.addEventListener('install', (event) => {
  const urlsToCache = [
    '/',
    'main.js',
    'data/restaurants.json',
    'img/',
    'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2'
  ]

  event.waitUntil(
    caches.open('restaurants-v1').then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  caches.match(event.request).then(response => {
    console.log(response)
    return response || fetch(event.request)
  }).catch(error => {
    console.log('error matching:', error)
  })
})
