// source: https://developers.google.com/web/fundamentals/primers/service-workers/
importScripts('idblib.js')

const staticCacheName = 'restaurant-static-v1'

self.addEventListener('install', (event) => {
  const urlsToCache = [
    '/',
    '/restaurant.html',
    'main.js',
    'restaurantInfo.js',
    'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2',
    'img/1.webp',
    'img/2.webp',
    'img/3.webp',
    'img/4.webp',
    'img/5.webp',
    'img/6.webp',
    'img/7.webp',
    'img/8.webp',
    'img/9.webp',
    'img/10.webp',
    'img/responsive/1-small.webp',
    'img/responsive/2-small.webp',
    'img/responsive/3-small.webp',
    'img/responsive/4-small.webp',
    'img/responsive/5-small.webp',
    'img/responsive/6-small.webp',
    'img/responsive/7-small.webp',
    'img/responsive/8-small.webp',
    'img/responsive/9-small.webp',
    'img/responsive/10-small.webp',
    'img/responsive/1-medium.webp',
    'img/responsive/2-medium.webp',
    'img/responsive/3-medium.webp',
    'img/responsive/4-medium.webp',
    'img/responsive/5-medium.webp',
    'img/responsive/6-medium.webp',
    'img/responsive/7-medium.webp',
    'img/responsive/8-medium.webp',
    'img/responsive/9-medium.webp',
    'img/responsive/10-medium.webp',
    'img/gmaps-icon.png'
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
    caches.match(event.request, {ignoreSearch: true}).then(response => {
      if (response) {
        // console.log('return response', response)
        return response
      }
      var fetchRequest = event.request.clone()

      // Otherwise goes to the network
      return fetch(fetchRequest)
        .then(response => {
          const dataToCache = response.clone()
          // We cache everything we are requesting and haven't cached yet
          if (response.type === 'basic' || event.request.url.indexOf('https://maps.googleapis.com/maps/api/js') === 0) {
            caches.open(staticCacheName).then((cache) => {
              return cache.put(event.request, dataToCache)
            })
          }
          return response
        })
    })
  )
})

// Inspiration here: https://www.twilio.com/blog/2017/02/send-messages-when-youre-back-online-with-service-workers-and-background-sync.html
// When the app requests a sync, check if there are some reviews that need to be posted
self.addEventListener('sync', (event) => {
  console.log('sync!')
  if (event.tag === 'sync-reviews') {
    event.waitUntil(
    // Sync Reviews
      store.pendingStore('readonly').then(pendingStore => pendingStore.getAll()) // retrieve all stored pending reviews
        .then(pendingReviews => {
          console.log('pendingReviews', pendingReviews)
          if (pendingReviews.length > 0) {
            console.log('There are', pendingReviews.length, 'reviews to sync')
            // Iterating through all the reviews to send them over to the server
            return Promise.all(pendingReviews.map(pReview => {
              return fetch('http://localhost:1337/reviews', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(pReview)
              })
                .then(data => {
                  return store.pendingStore('readwrite')
                    .then(pendingStore => {
                      return pendingStore.delete(pReview.id)
                    })
                })
            }))
              .then(() => {
                self.clients.matchAll().then((clients) => {
                  clients.forEach((client) => client.postMessage('reload-window'))
                })
              })
          }
        })
    )
  }
  // Sync Favorites
  if (event.tag === 'sync-favs') {
    event.waitUntil(
      store.pendingFavorites('readonly').then(pendingStore => pendingStore.getAll()) // retrieve all stored pending reviews
        .then(pendingFavorites => {
          console.log('pendingFavorites', pendingFavorites)
          if (pendingFavorites.length > 0) {
            console.log('There are', pendingFavorites.length, 'favorites to sync')
            // Iterating through all the favorites to send them over to the server
            return Promise.all(pendingFavorites.map(pFav => {
              return fetch(`http://localhost:1337/restaurants/${pFav.restaurantId}/?is_favorite=${pFav.isFavorite}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
              })
                .then(data => {
                  console.log('favs synced')
                  return store.pendingFavorites('readwrite')
                    .then(pendingStore => {
                      return pendingStore.delete(pFav.id)
                    })
                })
            }))
              .then(() => {
                self.clients.matchAll().then((clients) => {
                  clients.forEach((client) => client.postMessage('reload-window'))
                })
              })
          }
        })
    )
  }
})

const store = {
  dbPromise: () => {
    return idb.open('restaurant-db', 1, (upgradeDb) => {
      return upgradeDb.createObjectStore(this.PENDING_STORE, { autoIncrement: true, keyPath: 'id' })
    })
  },

  pendingStore: (mode) => {
    return store.dbPromise().then(db => {
      return db.transaction('pending', mode).objectStore('pending')
    })
  },

  pendingFavorites: (mode) => {
    return store.dbPromise().then(db => {
      return db.transaction('favorite', mode).objectStore('favorite')
    })
  }
}
