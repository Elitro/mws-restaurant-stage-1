
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('sw.js').then(registration => {
    console.log('SW registered with scope:', registration.scope)
  }).catch(error => {
    console.log('Failed to register the SW', error)
  })
}
