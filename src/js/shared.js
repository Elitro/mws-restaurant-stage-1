export const initGMaps = () => {
  const script = document.createElement('script')
  script.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCAW3s5PAqIbjKvYWp5hU9KYxGpyREbZR4&libraries=places&callback=initMap')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('defer', 'defer')
  document.getElementsByTagName('body')[0].appendChild(script)
}
