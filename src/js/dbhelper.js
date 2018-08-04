import IDB from './idb'

/**
 * Common database helper functions.
 */
class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL () {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/data/restaurants.json`
  }

  /** Fetch all restaurants.
   */
  static fetchRestaurants () {
    // First we check the server
    return fetch('http://localhost:1337/restaurants')
      .then(response => {
        if (response.status !== 200) {
          console.log('Error fetching restaurants')
          return
        }
        const dataPromise = response.json()
        // Store restaurants
        IDB.storeRestaurants(dataPromise)
        return dataPromise
      })
      // If the server is offline we check IDB
      .catch(() => {
        return IDB.getAllRestaurants()
      })
  }

  /** Fetch a restaurant by its ID. */
  static fetchRestaurantById (id) {
    return IDB.getRestaurantById(id)
      .then(restaurant => {
        if (!restaurant) {
          return fetch(`http://localhost:1337/restaurants/${id}`)
            .then(response => response.json())
            .catch(e => console.log('error: ', e))
        }
        return restaurant
      })
  }

  /** Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine (cuisine) {
    return DBHelper.fetchRestaurants()
      .then(restaurants => {
        // Filter restaurants to have only given cuisine type
        return restaurants.filter(r => r.cuisine_type == cuisine)
      })
  }

  /** Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood (neighborhood) {
    return DBHelper.fetchRestaurants()
      .then(restaurants => {
      // Filter restaurants to have only given neighborhood
        return restaurants.filter(r => r.neighborhood == neighborhood)
      })
  }

  /** Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood (cuisine, neighborhood, callback) {
    return DBHelper.fetchRestaurants()
      .then(restaurants => {
        if (cuisine != 'all') { // filter by cuisine
          restaurants = restaurants.filter(r => r.cuisine_type == cuisine)
        }
        if (neighborhood != 'all') { // filter by neighborhood
          restaurants = restaurants.filter(r => r.neighborhood == neighborhood)
        }
        return restaurants
      })
  }

  /** Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods (callback) {
    return DBHelper.fetchRestaurants()
      .then(restaurants => {
      // Filter restaurants to have only given neighborhood
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        return neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
      })
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines (callback) {
    return DBHelper.fetchRestaurants()
      .then(restaurants => {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        return cuisines.filter((v, i) => cuisines.indexOf(v) == i)
      })
  }

  /** Restaurant page URL.
   */
  static urlForRestaurant (restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`)
  }

  /** Restaurant image URL.
   */
  static imageUrlForRestaurant (restaurant) {
    return (`/img/${restaurant.photograph}.webp`)
  }

  /** Restaurant responsive image URL
   * Hardcoded to simplify things
   */
  static responsiveImageUrlForRestaurant (restaurant) {
    const extension = 'webp'
    // const parsedImageName = restaurant.photograph.split('.')
    const srcset = `
    /img/responsive/${restaurant.photograph}-small.${extension}} 480w,
    /img/responsive/${restaurant.photograph}-medium.${extension}} 640w,
    ${this.imageUrlForRestaurant(restaurant)} 800w
    `
    return srcset
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant (restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    )
    return marker
  }
}

export default DBHelper
