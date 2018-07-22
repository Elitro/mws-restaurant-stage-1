import DBHelper from './dbhelper'
import { initGMaps, configureImg } from './shared'
import review from '../components/review/review'
import { getRestaurantReview } from './requests'

class RestaurantInfo {
  constructor () {
    this.restaurant = null
    this.map = null

    this.initMap()
    initGMaps()
  }

  /** Initialize Google map, called from HTML. */
  initMap () {
    window.initMap = () => {
      this.fetchRestaurantFromURL()
        .then((restaurant) => {
          this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: restaurant.latlng,
            scrollwheel: false
          })
          this.fillBreadcrumb(this.restaurant)
          DBHelper.mapMarkerForRestaurant(this.restaurant, this.map)
        })
        .catch(error => console.error(error))
    }
  }

  /** Get current restaurant from page URL. */
  fetchRestaurantFromURL (restaurant) {
    if (this.restaurant) { // restaurant already fetched!
      // return this.restaurant
      return new Promise((resolve) => resolve(this.restaurant))
    }
    const id = this.getParameterByName('id')
    if (!id) { // no id found in URL
      return new Promise((resolve, reject) => reject(new Error('No restaurant id in URL')))
    } else {
      return DBHelper.fetchRestaurantById(id)
        .then(restaurant => {
          this.restaurant = restaurant
          this.fillRestaurantHTML(restaurant)
          return restaurant
        })
    }
  }

  /** Create restaurant HTML and add it to the webpage */
  fillRestaurantHTML (restaurant) {
    const name = document.getElementById('restaurant-name')
    name.innerHTML = restaurant.name

    const address = document.getElementById('restaurant-address')
    address.innerHTML = restaurant.address

    const image = document.getElementById('restaurant-img')
    configureImg(image, restaurant, DBHelper)

    const cuisine = document.getElementById('restaurant-cuisine')
    cuisine.innerHTML = restaurant.cuisine_type

    // fill operating hours
    if (restaurant.operating_hours) {
      this.fillRestaurantHoursHTML(restaurant.operating_hours)
    }
    // fill reviews
    // this.fillReviewsHTML(restaurant.reviews)
    getRestaurantReview(restaurant.id)
      .then(reviews => {
        this.fillReviewsHTML(reviews)
      })
      .catch(error => console.log('Error fetching reviews for restaurant', restaurant.id, error))

    // Add review form
    const newReview = review(restaurant.id)
    // debugger//eslint-disable-line
    const currentReview = document.getElementById('review-form')
    currentReview.parentNode.replaceChild(newReview, currentReview)
  }

  /** Create restaurant operating hours HTML table and add it to the webpage. */
  fillRestaurantHoursHTML (operatingHours) {
    const hours = document.getElementById('restaurant-hours')
    for (let key in operatingHours) {
      const row = document.createElement('tr')

      const day = document.createElement('td')
      day.innerHTML = key
      row.appendChild(day)

      const time = document.createElement('td')
      time.innerHTML = operatingHours[key]
      row.appendChild(time)

      hours.appendChild(row)
    }
  }

  /** Create all reviews HTML and add them to the webpage. */
  fillReviewsHTML (reviews) {
    const container = document.getElementById('reviews-container')
    const title = document.createElement('h3')
    title.className = 'review-h3'
    title.innerHTML = 'Reviews'
    container.appendChild(title)

    if (!reviews) {
      const noReviews = document.createElement('p')
      noReviews.innerHTML = 'No reviews yet!'
      container.appendChild(noReviews)
      return
    }
    const ul = document.getElementById('reviews-list')
    reviews.forEach(review => {
      ul.appendChild(this.createReviewHTML(review))
    })
    container.appendChild(ul)
  }

  /** Create review HTML and add it to the webpage. */
  createReviewHTML (review) {
    const li = document.createElement('li')
    const name = document.createElement('p')
    name.innerHTML = review.name
    li.appendChild(name)

    const date = document.createElement('p')
    const parsedDate = new Date(review.createdAt)
    date.innerHTML = `${parsedDate.getDay()}/${parsedDate.getMonth()}/${parsedDate.getFullYear()}`
    li.appendChild(date)

    const rating = document.createElement('p')
    rating.innerHTML = `Rating: ${review.rating}`
    li.appendChild(rating)

    const comments = document.createElement('p')
    comments.innerHTML = review.comments
    li.appendChild(comments)

    return li
  }

  /** Add restaurant name to the breadcrumb navigation menu */
  fillBreadcrumb (restaurant) {
    const breadcrumb = document.getElementById('breadcrumb')
    const li = document.createElement('li')
    li.innerHTML = restaurant.name
    breadcrumb.appendChild(li)
  }

  /** Get a parameter by name from page URL. */
  getParameterByName (name, url) {
    if (!url) { url = window.location.href }
    name = name.replace(/[\[\]]/g, '\\$&')
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
    const results = regex.exec(url)
    if (!results) { return null }
    if (!results[2]) { return '' }
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
  }
}

export default RestaurantInfo
