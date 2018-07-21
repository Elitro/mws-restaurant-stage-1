const PORT = 1337
const ENDPOINT = `http://localhost:${PORT}/restaurants/`

/**
 * REST method to favorite a restaurant
 *
 * @example http://localhost:1337/restaurants/<restaurant_id>/?is_favorite=true
 *
 */
const addToFavorites = (restaurantId, isFavorite) => {
  const url = `${ENDPOINT}${restaurantId}/?is_favorite=${!isFavorite}`
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
}

export {
  addToFavorites
}
