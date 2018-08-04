import {addReview} from '../../js/requests'
import reviewRating from '../review-rating/review-rating'

/**
 * Restaurant Review Component
 */
const review = (restaurantId, addReviewHandler) => {
  const review = document.createElement('section')
  review.className = 'add-review-container'

  // Title
  const title = document.createElement('h3')
  title.className = 'review-h3'
  title.innerHTML = 'Add Your Review!'
  review.appendChild(title)

  // Name
  const reviewNameId = 'review-name'
  const reviewName = document.createElement('input')
  reviewName.type = 'text'
  reviewName.id = reviewNameId

  const reviewNameLabel = document.createElement('label')
  reviewNameLabel.setAttribute('for', reviewNameId)
  reviewNameLabel.innerHTML = 'Name'
  reviewNameLabel.className = 'review-label'

  review.appendChild(reviewNameLabel)
  review.appendChild(reviewName)

  // Rating
  const reviewRatingElement = reviewRating()
  review.appendChild(reviewRatingElement)

  // Comments
  const reviewCommentsId = 'review-comments'
  const reviewCommentsLabel = document.createElement('label')
  reviewNameLabel.setAttribute('for', reviewCommentsId)

  const reviewComments = document.createElement('textarea')
  reviewComments.id = reviewCommentsId
  reviewComments.setAttribute('rows', 5)
  reviewComments.setAttribute('cols', 50)

  review.appendChild(reviewCommentsLabel)
  review.appendChild(reviewComments)

  // Add Review
  const addReviewButton = document.createElement('button')
  addReviewButton.className = 'review-button'
  addReviewButton.innerHTML = 'Post Review'

  addReviewButton.addEventListener('click', () => {
    const reviewJson = {
      'restaurant_id': restaurantId,
      name: reviewName.value,
      rating: reviewRatingElement.getAttribute('data-selection') || 0,
      comments: reviewComments.value
    }

    // DEFER TODO: Check if there are pending reviews first instead of always syncing
    // When posting another review, check if there are reviews to sync
    navigator.serviceWorker.ready.then(function (swRegistration) {
      return swRegistration.sync.register('sync-reviews')
    })

    addReview(reviewJson)
      .then((message) => {
        addReviewHandler(reviewJson) // append new review to the html
        // DEFER TODO: After adding the review the button switches to edit
      })
  })
  review.appendChild(addReviewButton)

  // DEFER TODO: Add the edit review functionality
  return review
}

export default review
