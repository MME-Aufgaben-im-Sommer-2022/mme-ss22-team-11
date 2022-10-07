import { CocktailListManager } from './cocktailData/cocktailListManager.js'
import { HtmlManipulator } from './ui/ProfileHtmlManipulator.js'
import { Login } from './profile/login.js'
import { BannedIngredientsView } from './ui/profile/BannedIngredientsView.js'
import { IngredientFilterManager } from './cocktailData/ingredientFilterManager.js'
import { ReviewSectionView } from './ui/profile/ReviewSectionView.js'

const htmlManipulator = new HtmlManipulator()
const login = new Login()
const user = login.getDefaultUser()

const userData = JSON.parse(localStorage.getItem('USER'))
user.username = userData.username
user.email = userData.email
user.createdCocktails = userData.createdCocktails
user.favorites = userData.favorites
user.blackListedIngredients = userData.blackListedIngredients
user.givenRatings = userData.givenRatings

const cocktailListManager = new CocktailListManager()
const bannedIngredientsView = new BannedIngredientsView(user.blackListedIngredients)
const ingredientFilterManager = new IngredientFilterManager()
const reviewSectionView = new ReviewSectionView()

cocktailListManager.getCocktailsFromDB()

localStorage.clear()
user.addEventListener('USER_DATA_CHANGED', (event) => login.updateUser(event.data))
user.addEventListener('DELETE_RATING', (event) => cocktailListManager.deleteRating(event.data))

// cocktailListManager.addEventListener("DATA_READY", showFavorites());

// banned ing search
const showIngredients = () => {
  bannedIngredientsView.refreshSearchResults(ingredientFilterManager.displayList)
}
ingredientFilterManager.addEventListener('INGREDIENT_DATA_READY', () => showIngredients())
ingredientFilterManager.addEventListener('INGREDIENT_DATA_UPDATED', () => showIngredients())

bannedIngredientsView.addEventListener('INGREDIENT_SELECTED', (event) => {
  console.log('add to blacklisted', event.data)
  user.addIngredientToBlackList(event.data)
})
bannedIngredientsView.addEventListener('INGREDIENT_UNSELECTED', (event) => {
  console.log('remove to blacklisted', event.data)
  user.deleteIngredientFromBlackList(event.data)
})

let timeout = null
const responseDelay = 500

const searchInput = bannedIngredientsView.el.querySelector('.search-ingredient')
searchInput.addEventListener('keyup', function () {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    ingredientFilterManager.searchIngredientByName(searchInput.value)
  }, responseDelay)
})

bannedIngredientsView.showBannedIngredients()

htmlManipulator.addEventListener('CHANGE_PROFILE_CONTENT', (event) => {
  if (event.data === 'banned-ingredients') {
    bannedIngredientsView.showBannedIngredients()
  // } else if (event.data == "created-cocktails") {
  //  console.log("created-cocktails");
  } else {
    reviewSectionView.showReviewSection()
    reviewSectionView.refreshReviews(getReviews())
    reviewSectionView.addEventListener('RATING_DELETION', (event) => {
      user.deleteRating(event.data.cocktail.id)
    })
  }
})

document.querySelector('#recipes-link').addEventListener('click', (event) => {
  user.listener = {}
  user.allIngredients = {}
  localStorage.setItem('USER', JSON.stringify(user))
  window.open('./index.html', '_self')
})

// Get Reviews & Delete 1  Review

function getReviews () {
  const lst = []

  user.givenRatings.forEach(data => {
    const obj = {}
    console.log(cocktailListManager)
    const cocktail = cocktailListManager.getCocktailForID(data.cocktailID)
    obj.cocktail = cocktail
    obj.rating = data.rating
    lst.push(obj)
  })

  return lst
}
