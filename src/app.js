
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('sw.js').then(registration => {
    console.log('SW registered with scope:', registration.scope)

    if ('sync' in registration) {
      navigator.serviceWorker.ready.then(function (swRegistration) {
        return swRegistration.sync.register('sync-reviews')
      })
    }
  }).catch(error => {
    console.log('Failed to register the SW', error)
  })
}
