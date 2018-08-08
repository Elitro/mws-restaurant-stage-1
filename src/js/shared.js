export const initGMaps = () => {
  const script = document.createElement('script')
  script.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCAW3s5PAqIbjKvYWp5hU9KYxGpyREbZR4&libraries=places&callback=initMap')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('defer', 'defer')
  document.getElementsByTagName('body')[0].appendChild(script)
}

const restaurantAltText = [
  {id: 1, alt: 'Dining hall with yellow walls and people chatting and eating'},
  {id: 2, alt: 'Pizza sliced in eight'},
  {id: 3, alt: 'Empty dining hall with wood furniture'},
  {id: 4, alt: 'Outside the building view with people walking around'},
  {id: 6, alt: 'People sitting at tables and waiters doing stuff'},
  {id: 7, alt: 'People eating in a room with the american flag as decoration'},
  {id: 8, alt: 'Black and white picture of a man walking a dog next to a burger restaurant sign and some people eating inside'},
  {id: 9, alt: 'The dutch sign over the entrance'},
  {id: 10, alt: 'People eating and woman looking at her cell phone'}
]

export const configureImg = (image, restaurant, DBHelper) => {
  // const imageInfo = `Restaurant ${restaurant.name}`
  const imageInfo = restaurantAltText.find(element => {
    if (element.id === restaurant.id) return element
    return {alt: ''}
  }).alt
  image.className = 'restaurant-img lazy'
  image.setAttribute('data-srcset', DBHelper.responsiveImageUrlForRestaurant(restaurant))
  image.sizes = `(max-width: 480px) 320px,
                  (max-width: 768px) 480px,
                  50vw`
  image.alt = imageInfo
  image.title = imageInfo
}

export const toggleButton = ({className, innerHTML, clickHandler, isToggled}) => {
  const button = document.createElement('button')
  button.className = className
  button.innerHTML = innerHTML
  button.addEventListener('click', clickHandler)
  button.setAttribute('aria-pressed', isToggled)
  button.setAttribute('aria-label', 'Set as favorite')

  return button
}

/**
   * Make images lazily loaded
   * Source: https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/
  */
export const setLazyLoadImagesObservable = () => {
  var lazyImages = [].slice.call(document.querySelectorAll('img.lazy'))

  if ('IntersectionObserver' in window) {
    let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target
          lazyImage.srcset = lazyImage.dataset.srcset
          lazyImage.removeAttribute('data-srcset')
          lazyImage.classList.remove('lazy')
          lazyImageObserver.unobserve(lazyImage)
        }
      })
    })

    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage)
    })
  }
}

const hideElement = (syncElement) => {
  syncElement.style.opacity = 0
  syncElement.style.display = 'hidden'
  syncElement.setAttribute('aria-hidden', true)
  syncElement.style.height = 0
}

export const toggleSyncMessage = () => {
  let syncElement = document.getElementById('sync-message')
  syncElement.style.height = 'auto'
  syncElement.style.display = 'block'
  syncElement.style.opacity = 1
  syncElement.setAttribute('aria-hidden', false)

  setTimeout(() => hideElement(syncElement), 5000)

  // syncElement.addEventListener('transitionend', hideElement.bind(event, syncElement))
  // syncElement.removeEventListener('transitionend', hideElement)
}
