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
  })
}

const editReview = ({name, rating, comments, reviewId}) => {
  const url = `${ENDPOINT}reviews/${reviewId}`

  const reviewBody = {
    name,
    rating,
    comments
  }

  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(reviewBody)
  })
}

const getRestaurantReview = (restaurantId) => {
  const url = `${ENDPOINT}reviews/?restaurant_id=${restaurantId}`
  return fetch(url)
    .then(reviews => reviews.json())
}

export {
  addToFavorites,
  addReview,
  editReview,
  getRestaurantReview
}
