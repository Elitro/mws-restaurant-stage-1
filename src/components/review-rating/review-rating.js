/**
 * Review Rating Radio Group
 *
 * 5 levels rating system
 */
const reviewRating = () => {
  const reviewRatingId = 'review-rating'
  const reviewRating = document.createElement('div')
  reviewRating.className = 'review-rating'
  reviewRating.addEventListener('click', () => setSelectedValue(
    reviewRating.querySelector('input[name="rating"]:checked').value,
    reviewRating
  ))

  // Label
  const reviewRatingLabel = document.createElement('label')
  reviewRatingLabel.setAttribute('for', reviewRatingId)
  reviewRatingLabel.innerHTML = 'Select your rating'
  reviewRatingLabel.className = 'review-label'
  reviewRating.appendChild(reviewRatingLabel)

  // Radio Group
  const reviewRatingGroup = document.createElement('div')
  reviewRatingGroup.setAttribute('role', 'radiogroup')
  reviewRatingGroup.setAttribute('aria-label', 'Rate the restaurant')

  // Radio Options
  for (let index = 1; index <= 5; index++) {
    const elementId = `rating-option-${index}`

    const elementLabel = document.createElement('label')
    elementLabel.setAttribute('for', elementId)
    elementLabel.innerHTML = index

    const element = document.createElement('input')
    element.id = elementId
    element.type = 'radio'
    element.name = 'rating'
    element.value = index
    reviewRatingGroup.appendChild(elementLabel)
    reviewRatingGroup.appendChild(element)
  }
  reviewRating.appendChild(reviewRatingGroup)

  return reviewRating
}

const setSelectedValue = (value, reviewRating) => {
  // debugger//eslint-disable-line
  reviewRating.setAttribute('data-selection', value)
}

export default reviewRating
