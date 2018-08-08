
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('sw.js').then(registration => {
    console.log('SW registered with scope:', registration.scope)
  }).catch(error => {
    console.log('Failed to register the SW', error)
  })

  /**
   * Reloads the application
   *
   * After the service worker successfully syncs offline data
   * it messages the app to reload.
   */
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data === 'reload-window') {
      window.location.reload()
    }
  })
}
