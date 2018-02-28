import DBHelper from './dbhelper'
import { initGMaps } from './shared'

class Main {
  constructor () {
    this.restaurants = []
    this.neighborhoods = null
    this.cuisines = null
    this.markers = []
    this.map = null

    this.setEventListeners()
    this.initMap()
    initGMaps()
    this.loadData()
  }

  /** Initialize Google map, called from HTML. */
  initMap () {
    window.initMap = () => {
      let loc = {
        lat: 40.722216,
        lng: -73.987501
      }
      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: loc,
        scrollwheel: false
      })
      this.updateRestaurants()
    }
  }

  setEventListeners () {
    // Set change event for the neighborhoods
    document.getElementById('neighborhoods-select').addEventListener('change', this.updateRestaurants.bind(this))
    document.getElementById('cuisines-select').addEventListener('change', this.updateRestaurants.bind(this))
  }

  /** Update page and map for current restaurants. */
  updateRestaurants () {
    const cSelect = document.getElementById('cuisines-select')
    const nSelect = document.getElementById('neighborhoods-select')

    const cIndex = cSelect.selectedIndex
    const nIndex = nSelect.selectedIndex

    const cuisine = cSelect[cIndex].value
    const neighborhood = nSelect[nIndex].value

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
      if (error) { // Got an error!
        console.error(error)
      } else {
        this.resetRestaurants(restaurants)
        this.fillRestaurantsHTML(this.restaurants)
      }
    })
  }

  /** Fetch neighborhoods and cuisines as soon as the page is loaded. */
  loadData () {
    document.addEventListener('DOMContentLoaded', (event) => {
      this.fetchNeighborhoods()
      this.fetchCuisines()
    })
  }

  /** Fetch all neighborhoods and set their HTML. */
  fetchNeighborhoods () {
    DBHelper.fetchNeighborhoods((error, neighborhoods) => {
      if (error) { // Got an error
        console.error(error)
      } else {
        this.neighborhoods = neighborhoods
        this.fillNeighborhoodsHTML(neighborhoods)
      }
    })
  }

  /** Set neighborhoods HTML. */
  fillNeighborhoodsHTML (neighborhoods) {
    const select = document.getElementById('neighborhoods-select')
    neighborhoods.forEach(neighborhood => {
      const option = document.createElement('option')
      option.innerHTML = neighborhood
      option.value = neighborhood
      select.append(option)
    })
  }

  /** Fetch all cuisines and set their HTML. */
  fetchCuisines () {
    DBHelper.fetchCuisines((error, cuisines) => {
      if (error) { // Got an error!
        console.error(error)
      } else {
        this.cuisines = cuisines
        this.fillCuisinesHTML(cuisines)
      }
    })
  }

  /** Set cuisines HTML. */
  fillCuisinesHTML (cuisines) {
    const select = document.getElementById('cuisines-select')

    cuisines.forEach(cuisine => {
      const option = document.createElement('option')
      option.innerHTML = cuisine
      option.value = cuisine
      select.append(option)
    })
  }

  /** Clear current restaurants, their HTML and remove their map markers. */
  resetRestaurants (restaurants) {
  // Remove all restaurants
    this.restaurants = []
    const ul = document.getElementById('restaurants-list')
    ul.innerHTML = ''

    // Remove all map markers
    this.markers.forEach(m => m.setMap(null))
    this.markers = []
    this.restaurants = restaurants
  }

  /** Create all restaurants HTML and add them to the webpage. */
  fillRestaurantsHTML (restaurants) {
    const ul = document.getElementById('restaurants-list')
    restaurants.forEach(restaurant => {
      ul.append(this.createRestaurantHTML(restaurant))
    })
    this.addMarkersToMap(restaurants)
  }

  /** Create restaurant HTML. */
  createRestaurantHTML (restaurant) {
    const li = document.createElement('li')

    const image = document.createElement('img')
    image.className = 'restaurant-img'
    image.src = DBHelper.imageUrlForRestaurant(restaurant)
    li.append(image)

    const name = document.createElement('h1')
    name.innerHTML = restaurant.name
    li.append(name)

    const neighborhood = document.createElement('p')
    neighborhood.innerHTML = restaurant.neighborhood
    li.append(neighborhood)

    const address = document.createElement('p')
    address.innerHTML = restaurant.address
    li.append(address)

    const more = document.createElement('a')
    more.innerHTML = 'View Details'
    more.href = DBHelper.urlForRestaurant(restaurant)
    li.append(more)

    return li
  }

  /**
 * Add markers for current restaurants to the map.
 */
  addMarkersToMap (restaurants) {
    restaurants.forEach(restaurant => {
    // Add marker to the map
      const marker = DBHelper.mapMarkerForRestaurant(restaurant, this.map)
      google.maps.event.addListener(marker, 'click', () => {
        window.location.href = marker.url
      })
      this.markers.push(marker)
    })
  }
}

new Main()
// export default Main