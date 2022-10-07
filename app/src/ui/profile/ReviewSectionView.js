import { Observable, Event } from '../../utils/Observable.js'
import { ProfileReviewView } from './ProfileReviewView.js'

const PROFILE_REVIEW_SECTION_TEMPLATE = document.getElementById('reviews-section-template')
  .innerHTML.trim()

const SETTINGS_FRAME = document.querySelector('.settings-frame')
const reviewList = []

function createProfileReviewSection () {
  const el = document.createElement('div')
  el.innerHTML = PROFILE_REVIEW_SECTION_TEMPLATE
  return el.querySelector('.reviews-section')
}

class ReviewSectionView extends Observable {
  constructor () {
    super()
    this.el = createProfileReviewSection()
  }

  showReviewSection () {
    SETTINGS_FRAME.innerHTML = ''
    SETTINGS_FRAME.append(this.el)
  }

  addReview (reviewEntry) {
    console.log(reviewEntry)
    const reviewView = new ProfileReviewView(reviewEntry, this.el.querySelector('.reviews-container'))
    reviewView.fillHtml()
    reviewView.appendView()
    reviewList.push(reviewView)

    reviewView.addEventListener('RATING_DELETION', (event) => {
      this.notifyAll(new Event('RATING_DELETION', event.data))
    })
  }

  addAllReviews (data) {
    data.forEach(entry => this.addReview(entry))
  }

  removeAllReviews () {
    reviewList.forEach((view) => view.remove())
  }

  refreshReviews (data) {
    console.log(data)
    this.removeAllReviews()
    this.addAllReviews(data)
  }
}

export { ReviewSectionView }
