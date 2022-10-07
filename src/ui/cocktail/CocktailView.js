import { Observable, Event } from '../../utils/Observable.js'

const COCKTAIL_PAGE_TEMPLATE = document.getElementById(
  'cocktail-section-element-template').innerHTML.trim()
const REVIEW_CONTAINER_TEMPLATE = document.getElementById(
  'review-template').innerHTML.trim()
const MAX_STARS = 5

function createCocktailPageElement () {
  const el = document.createElement('div')
  el.innerHTML = COCKTAIL_PAGE_TEMPLATE
  return el.querySelector('.cocktail-section')
}

function createTags (el, cocktail) {
  let tags = []
  let text = ''
  const span = el.getElementsByClassName('tags')[0]
  tags = cocktail.tags

  if (tags.length === 0) {
    return
  }

  for (let i = 0; i < tags.length; i++) {
    text += tags[i]
    if (i < tags.length - 1) {
      text += ', '
    }
  }

  span.innerHTML = text
}

function createRating (el, cocktail) {
  const rating = cocktail.getRating()

  if (rating === undefined) {
    const noRating = document.createElement('div')
    noRating.innerHTML = 'Keine Bewertungen'
    el.querySelector('.avg-rating').append(noRating)
    return
  }

  for (let i = 0; i < MAX_STARS; i++) {
    const star = document.createElement('img')
    star.setAttribute('draggable', 'false')
    if (i < rating) {
      star.src = './resources/css/img/VectorStarFilledBlack.svg'
    } else {
      star.src = './resources/css/img/VectorStarHollowBlack.svg'
    }
    el.querySelector('.avg-rating').append(star)
  }
}

function createIngredients (el, ingredients, toBeSubbed, subDict) {
  ingredients.forEach(element => {
    const li = document.createElement('li')

    if (toBeSubbed.indexOf(element.ingredient.displayName) !== -1) {
      const subs = subDict[element.ingredient.displayName]
      let substituteString = 'Ersatzzutat: '

      if (subs.length > 1) {
        substituteString = 'Ersatzzutaten: '
      }

      subs.forEach((sub) => {
        substituteString += `${sub}, `
      })

      substituteString = substituteString.substring(0, substituteString.length - 2)

      li.textContent =
      `${element.ingredient.displayName} ${element.portion} ${element.unit}
      ${substituteString}`
      li.style.color = 'var(--light-orange-darker)'
    } else {
      li.textContent =
        `${element.ingredient.displayName} ${element.portion} ${element.unit}`
    }

    el.querySelector('.ingredients').append(li)
  })
}

function createInstructions (el, instructions) {
  for (let index = 1; index <= Object.keys(instructions).length; index++) {
    const li = document.createElement('li')
    li.textContent = instructions[index]
    el.querySelector('.instructions').append(li)
  }
}

function createReviewContainer () {
  const el = document.createElement('div')
  el.innerHTML = REVIEW_CONTAINER_TEMPLATE
  // console.log(el);
  return el.querySelector('.review')
}

function createReviews (el, reviews) {
  // reviews = [Rating(), Rating(), ...]
  // rating -> rating.stars (int), rating.text (string), rating.username (string)
  reviews.forEach((review) => {
    const container = createReviewContainer()
    // review user
    container.querySelector('h1').innerHTML = review.username
    // review text
    container.querySelector('.review-text').innerHTML = review.text
    // review stars
    for (let i = 0; i < MAX_STARS; i++) {
      const star = document.createElement('img')
      star.setAttribute('draggable', 'false')
      if (i < review.stars) {
        star.src = './resources/css/img/VectorStarFilledBlack.svg'
      } else {
        star.src = './resources/css/img/VectorStarHollowBlack.svg'
      }
      container.querySelector('.review-rating').append(star)
    }

    el.querySelector('.review-container').append(container)
  })
}

function initializeBackEventListeners (backButton, cocktailView) {
  backButton.addEventListener('mouseover', () => {
    backButton.src = './resources/css/img/VectorBackHover.svg'
  })
  backButton.addEventListener('mouseout', () => {
    backButton.src = './resources/css/img/VectorBack.svg'
  })
  backButton.addEventListener('click', () => {
    cocktailView.remove()
  })
}

function initializeRatingEventListeners (ratingInput, reviewInput, sendButton, cocktailView) {
  let stars = ratingInput.querySelectorAll('img')
  let rating = 0
  stars = Array.from(stars)

  stars.forEach(element => {
    element.addEventListener('click', () => {
      rating = stars.indexOf(element) + 1
      for (let i = 0; i < stars.indexOf(element) + 1; i++) {
        stars[i].src = './resources/css/img/VectorStarFilledAccent.svg'
      }
      for (let i = stars.indexOf(element) + 1; i < MAX_STARS; i++) {
        stars[i].src = './resources/css/img/VectorStarHollowAccent.svg'
      }
    })
  })
  sendButton.addEventListener('click', () => {
    const review = reviewInput.value
    const data = {}
    data.id = cocktailView.cocktail.id
    data.rating = rating
    data.review = review
    cocktailView.notifyAll(new Event('REVIEW SUBMITTED', data))
  })
}

function setFavButton (el, user, cocktail, favButton) {
  if (user.favorites.indexOf(cocktail.id) !== -1) {
    favButton.src = './resources/css/img/VectorFavFilled.svg'
    favButton.classList.add('active')
  } else {
    favButton.src = './resources/css/img/VectorFavHollow.svg'
    favButton.classList.remove('active')
  }
}

class CocktailView extends Observable {
  constructor (cocktail, user) {
    super()
    this.cocktail = cocktail
    this.el = createCocktailPageElement()
    this.user = user
    window.scrollTo(0, 0)
  }

  fillHtml () {
    this.el.querySelector('.cocktail-image').style.background = `url(${this.cocktail.image}) center`
    this.el.querySelector('.cocktail-image').style.backgroundSize = 'cover'
    this.el.querySelector('.name').textContent = this.cocktail.name

    createTags(this.el, this.cocktail)
    createRating(this.el, this.cocktail)
    createIngredients(this.el, this.cocktail.recipe.mainIngredients, this.cocktail.toBeSubbed, this.cocktail.subDict)
    createInstructions(this.el, this.cocktail.steps)
    createReviews(this.el, this.cocktail.ratings)

    const backButton = this.el.querySelector('.cocktail-back')
    const favButton = this.el.querySelector('.cocktail-fav')
    const ratingInput = this.el.querySelector('.rating-input')
    const reviewInput = this.el.querySelector('.review-input')
    const sendButton = this.el.querySelector('.send-icon')

    initializeRatingEventListeners(ratingInput, reviewInput, sendButton, this)

    initializeBackEventListeners(backButton, this)

    if (this.user !== undefined) {
      setFavButton(this.el, this.user, this.cocktail, favButton)

      favButton.addEventListener('mouseover', () => {
        favButton.src = './resources/css/img/VectorFavHover.svg'
      })

      favButton.addEventListener('mouseout', () => {
        if (favButton.classList.contains('active')) {
          favButton.src = './resources/css/img/VectorFavFilled.svg'
        } else {
          favButton.src = './resources/css/img/VectorFavHollow.svg'
        }
      })

      favButton.addEventListener('click', () => {
        if (favButton.classList.contains('active')) {
          this.notifyAll(new Event('COCKTAIL_UNFAV', this.cocktail.id))
          favButton.classList.remove('active')
          favButton.src = './resources/css/img/VectorFavHollow.svg'
        } else {
          this.notifyAll(new Event('COCKTAIL_FAV', this.cocktail.id))
          favButton.classList.add('active')
          favButton.src = './resources/css/img/VectorFavFilled.svg'
        }
      })
    }
  }

  showCocktailPage () {
    document.querySelector('#filter').style.display = 'none'
    document.querySelector('.cocktails').style.display = 'none'
    document.querySelector('body').append(this.el)
  }

  remove () {
    this.el.remove()
    document.querySelector('#filter').style.display = 'flex'
    document.querySelector('.cocktails').style.display = 'block'
  }

  clearInputs () {
    const ratingInput = this.el.querySelector('.rating-input')
    const reviewInput = this.el.querySelector('.review-input')

    reviewInput.textContent = ''

    let stars = ratingInput.querySelectorAll('img')
    stars = Array.from(stars)

    stars.forEach(element => {
      element.addEventListener('click', () => {
        for (let i = 0; i < MAX_STARS; i++) {
          stars[i].src = './resources/css/img/VectorStarHollowAccent.svg'
        }
      })
    })
  }
}

export { CocktailView }
