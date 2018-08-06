import IDB from './idb'

const PORT = 1337
const ENDPOINT = `http://localhost:${PORT}/`

/**
 * REST method to favorite a restaurant
 *
 * @example http://localhost:1337/restaurants/<restaurant_id>/?is_favorite=true
 *
 */
const addToFavorites = (restaurantId, isFavorite) => {
  const url = `${ENDPOINT}restaurants/${restaurantId}/?is_favorite=${isFavorite === 'false'}`
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
}

const addReview = (reviewBody) => {
  const url = `${ENDPOINT}reviews`

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(reviewBody)
  }).catch(() => {
    console.log('Error when adding the review, adding it to IDB')
    IDB.storeReviewInPending(reviewBody)
    // DEFER TODO: Check if there are pending reviews first instead of always syncing
    // Since the review post failed, request a sync event
    navigator.serviceWorker.ready.then(function (swRegistration) {
      return swRegistration.sync.register('sync-reviews')
    })
  })
}

const removeReview = (id) => {
  const url = `${ENDPOINT}reviews/${id}`

  return fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
}

const getRestaurantReview = (restaurantId) => {
  const url = `${ENDPOINT}reviews/?restaurant_id=${restaurantId}`

  return fetch(url)
  /** First we check the network, and store the reviews */
    .then(reviews => {
      const dataPromise = reviews.json()
      IDB.storeReviews(dataPromise)
      return dataPromise
    })
    /** If the network fails we check IDB */
    .catch(() => {
      console.log('Failed to get reviews! lets get them from IDB')
      return IDB.getReviewByRestaurantId(restaurantId)
    })
}

export {
  addToFavorites,
  addReview,
  getRestaurantReview,
  removeReview
}
