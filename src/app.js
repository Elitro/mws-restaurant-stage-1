
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('sw.js', {
    scope: '/'
  }).then(registration => {
    console.log('SW register:', registration)
  }).catch(error => {
    console.log('Failed to register the SW', error)
  })
}
