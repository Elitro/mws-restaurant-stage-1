import DBHelper from './dbhelper'
import { setLazyLoadImagesObservable, configureImg } from './shared'
import review from '../components/review/review'
import { getRestaurantReview, removeReview } from './requests'

class RestaurantInfo {
  constructor () {
    this.restaurant = null
    this.map = null

    this.initMap()
    // this.syncReviews()
  }

  /** Initialize Google map, called from HTML. */
  initMap () {
    const mapElement = document.getElementById('map')
    const mapDimensions = {
      width: 300,
      height: 400
    }
    const zoom = 16
    this.fetchRestaurantFromURL().then(restaurant => {
      setLazyLoadImagesObservable()
      this.fillBreadcrumb(this.restaurant)
      let url = `https://maps.googleapis.com/maps/api/staticmap?center=${restaurant.latlng.lat},${restaurant.latlng.lng}&zoom=12&scrollwheel=false&size=${mapDimensions.width}x${mapDimensions.height}&key=AIzaSyAlwebaE-fR1VJu8Inj60pUibFRpuQ7xqc&zoom=${zoom}`
      url += `&markers=color:red|label:S|${restaurant.latlng.lat},${restaurant.latlng.lng}`
      mapElement.src = url
    })
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
    getRestaurantReview(restaurant.id)
      .then(reviews => {
        this.fillReviewsHTML(reviews)
      })
      .catch(error => console.log('Error fetching reviews for restaurant', restaurant.id, error))

    const appendNewReview = (customReview) => {
      document.getElementById('reviews-list').appendChild(this.createReviewHTML(customReview))
    }

    // Add review form
    const newReview = review(restaurant.id, appendNewReview)
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

    if (review.createdAt) {
      const date = document.createElement('p')
      const parsedDate = new Date(review.createdAt)
      date.innerHTML = `${parsedDate.getDay()}/${parsedDate.getMonth()}/${parsedDate.getFullYear()}`
      li.appendChild(date)
    }

    const rating = document.createElement('p')
    rating.innerHTML = `Rating: ${review.rating}`
    li.appendChild(rating)

    const comments = document.createElement('p')
    comments.innerHTML = review.comments
    li.appendChild(comments)

    const removeButton = document.createElement('button')
    removeButton.innerHTML = 'Remove'
    removeButton.className = 'remove-button'
    removeButton.addEventListener('click', (e) => {
      e.stopPropagation()
      removeReview(review.id).then(() => li.remove())
    })
    li.appendChild(removeButton)

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

  // syncReviews () {
  //   navigator.serviceWorker.ready.then(function (swRegistration) {
  //     return swRegistration.sync.register('sync-reviews')
  //   })
  // }
}

export default RestaurantInfo
