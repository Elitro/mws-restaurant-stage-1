export const initGMaps = () => {
  const script = document.createElement('script')
  script.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCAW3s5PAqIbjKvYWp5hU9KYxGpyREbZR4&libraries=places&callback=initMap')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('defer', 'defer')
  document.getElementsByTagName('body')[0].appendChild(script)
}

export const configureImg = (image, restaurant, DBHelper) => {
  const imageInfo = `Restaurant ${restaurant.name}`
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
