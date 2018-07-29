// source: https://developers.google.com/web/fundamentals/primers/service-workers/

const staticCacheName = 'restaurant-static-v1'

self.addEventListener('install', (event) => {
  const urlsToCache = [
    '/',
    '/restaurant.html',
    'main.js',
    'restaurantInfo.js',
    'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg',
    'img/responsive/1-small.jpg',
    'img/responsive/2-small.jpg',
    'img/responsive/3-small.jpg',
    'img/responsive/4-small.jpg',
    'img/responsive/5-small.jpg',
    'img/responsive/6-small.jpg',
    'img/responsive/7-small.jpg',
    'img/responsive/8-small.jpg',
    'img/responsive/9-small.jpg',
    'img/responsive/10-small.jpg',
    'img/responsive/1-medium.jpg',
    'img/responsive/2-medium.jpg',
    'img/responsive/3-medium.jpg',
    'img/responsive/4-medium.jpg',
    'img/responsive/5-medium.jpg',
    'img/responsive/6-medium.jpg',
    'img/responsive/7-medium.jpg',
    'img/responsive/8-medium.jpg',
    'img/responsive/9-medium.jpg',
    'img/responsive/10-medium.jpg'
  ]

  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

/** Update the SW in the event of a new version */
self.addEventListener('activate', event => {
  console.log('activating')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('restaurant-static-') &&
            cacheName !== staticCacheName
        }).map(cacheName => {
          return caches.delete(cacheName)
        })
      )
    })
  )
})

// Whenever the SW detects a fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // First it checks if the request is in the cache
    caches.match(event.request).then(response => {
      if (response) {
        // console.log('return response', response)
        return response
      }
      var fetchRequest = event.request.clone()

      // Otherwise goes to the network
      return fetch(fetchRequest)
        .then(response => {
          const dataToCache = response.clone()
          // console.log('Requesting from the network', response)
          // We cache everything we are requesting and haven't cached yet
          if (response.type === 'basic' || event.request.url.indexOf('https://maps.googleapis.com/maps/api/js') === 0) {
            caches.open(staticCacheName).then((cache) => {
              return cache.put(event.request, dataToCache)
            })
          }
          return response
        })
        .catch(() => {
          return new Response('Offline!')
        })
    })
  )
})

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     // We first execute the request
//     fetch(event.request).then(response => {
//       const dataToCache = response.clone()
//       // We cache everything we are requesting and haven't cached yet
//       if (response.type === 'basic' || event.request.url.indexOf('https://maps.googleapis.com/maps/api/js') === 0) {
//         caches.open(staticCacheName).then((cache) => {
//           return cache.put(event.request, dataToCache)
//         })
//       }
//       return response
//     })
//     // If we go offline
//       .catch(() => {
//         // Look for a match
//         caches.match(event.request)
//           .then(response => {
//             if (response) {
//               console.log('return response')
//               return response
//             }
//             // var fetchRequest = event.request.clone()
//           })

//         // return new Response('Offline!')
//       })
//   )
// })

// When the app requests a sync, check if there are some reviews that need to be posted
// self.addEventListener('sync', (event) => {
//   if (event.tag === 'IDBSync') {
//     // event.waitUntil(doSomeStuff())
//   }
// })
