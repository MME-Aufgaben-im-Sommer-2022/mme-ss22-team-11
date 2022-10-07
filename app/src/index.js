import { HtmlManipulator } from './ui/RecipeHtmlManipulator.js'
import { CocktailListManager } from './cocktailData/cocktailListManager.js'
import { IngredientFilterManager } from './cocktailData/ingredientFilterManager.js'
import { ReviewManager } from './cocktailData/reviewManager.js'
import { ListView } from './ui/ListView.js'
import { IngredientListView } from './ui/ingredients/IngredientListView.js'
import { CocktailView } from './ui/cocktail/CocktailView.js'
import { User } from './profile/user.js'
import { Login } from './profile/login.js'
import { CocktailCreator } from './cocktailData/cocktailCreator.js'
import { LoginView } from './ui/LoginView.js'

const htmlManipulator = new HtmlManipulator()
const cocktailListManager = new CocktailListManager()
const ingredientFilterManager = new IngredientFilterManager()
const listView = new ListView()
const loginView = new LoginView()
const reviewManager = new ReviewManager()
const ingredientListView = new IngredientListView()
let cocktailCreator
const showCocktails = () => {
  listView.refreshCocktails(cocktailListManager.displayList, cocktailListManager.markedIDs, cocktailListManager.substitutedIngredients, cocktailListManager.substitutes)
}
const login = new Login()
let user

if (localStorage.getItem('USER') !== null) {
  makeUserFromLocalStorage()

  user.addEventListener('USER_DATA_CHANGED', (event) => login.updateUser(event.data))
  user.addEventListener('RATING_READY', (event) => {
    cocktailListManager.rateCocktail(event.data)
  })

  user.addEventListener('COCKTAIL_CREATION_REQUESTED', (event) => {
    console.log(event)
    cocktailListManager.addCustomCocktail(event.data)
  })
  cocktailListManager.addEventListener('COCKTAIL_CREATION_DONE', (event) => {
    user.onCocktailCreated(event.data)
  })

  htmlManipulator.addEventListener('FAV_SEARCH', (event) => toggleFavorites(event.data))
}

function makeUserFromLocalStorage () {
  const userData = JSON.parse(localStorage.getItem('USER'))

  user = new User()

  user.username = userData.username
  user.email = userData.email
  user.createdCocktails = userData.createdCocktails
  user.favorites = userData.favorites
  user.blackListedIngredients = userData.blackListedIngredients
  user.givenRatings = userData.givenRatings

  localStorage.clear()
}

htmlManipulator.addEventListener('COCKTAILCREATOR', (event) => {
  if (user !== undefined) {
    cocktailCreator = new CocktailCreator()
    cocktailCreator.addEventListener('COCKTAIL_DATA_FOR_USER', (event) => {
      user.createCocktail(event.data)
      console.log(event.data)
    })
  } else {
    loginView.initializeLoginView()
    loginView.showLoginView()
    loginView.addEventListener('USER_SUBMIT', (event) => {
      console.log(event.data)

      if (event.data[0] === undefined) {
        login.login(event.data[1], event.data[2])
      } else {
        login.singUp(event.data[0], event.data[1], event.data[2])
      }

      // TODO: work with user input here
      // if event.data[0] is undefined -> user wants to login
    })
  }
})

document.querySelector('#profile-link').addEventListener('click', (event) => {
  if (user !== undefined) {
    user.listener = {}
    user.allIngredients = {}

    const data = {}
    data.username = user.username
    data.email = user.email
    data.createdCocktails = user.createdCocktails
    data.favorites = user.favorites
    data.blackListedIngredients = user.blackListedIngredients
    data.givenRatings = user.givenRatings

    localStorage.setItem('USER', JSON.stringify(data))
    window.open('./profile.html', '_self')
  } else {
    // open signup/login fenster
    loginView.initializeLoginView()
    loginView.showLoginView()
    loginView.addEventListener('USER_SUBMIT', (event) => {
      if (event.data[0] === undefined) {
        login.login(event.data[1], event.data[2])
      } else {
        login.singUp(event.data[0], event.data[1], event.data[2])
      }
    })
  }
})

login.addEventListener('LOGIN', (event) => {
  loginView.removeLoginView()
  user = event.data
  user.addEventListener('USER_DATA_CHANGED', (event) => login.updateUser(event.data))
  user.addEventListener('RATING_READY', (event) => {
    cocktailListManager.rateCocktail(event.data)
  })

  user.addEventListener('COCKTAIL_CREATION_REQUESTED', (event) => {
    console.log(event)
    cocktailListManager.addCustomCocktail(event.data)
  })
  cocktailListManager.addEventListener('COCKTAIL_CREATION_DONE', (event) => {
    user.onCocktailCreated(event.data)
  })
  cocktailListManager.filterCocktailsByBannedIngredient(user.blackListedIngredients)
  htmlManipulator.addEventListener('FAV_SEARCH', (event) => toggleFavorites(event.data))
})

function toggleFavorites (data) {
  if (data === 'ACTIVATED') {
    cocktailListManager.updateDisplayList(cocktailListManager.getFavorites(user.favorites))
  } else {
    cocktailListManager.updateDisplayList(cocktailListManager.allCocktails)
    addIngredientFilter()
  }
}

cocktailListManager.addEventListener('DATA_READY', (event) => showCocktails())
cocktailListManager.addEventListener('DATA_UPDATED', (event) => showCocktails())
cocktailListManager.addEventListener('READY_FOR_COCKTAILS', (event) => cocktailListManager.onReadyForCocktails())

// Ingredient Filter
ingredientFilterManager.addEventListener('INGREDIENT_DATA_READY', (event) => showIngredients())
ingredientFilterManager.addEventListener('INGREDIENT_DATA_UPDATED', (event) => showIngredients())

ingredientListView.addEventListener('INGREDIENT_SELECTED', (event) => filterCocktails())
ingredientListView.addEventListener('INGREDIENT_UNSELECTED', (event) => filterCocktails())

const filterCocktails = () => {
  const selected = ingredientListView.getAllSelected()

  cocktailListManager.getCocktailsFromIngredients(selected, false)
  addIngredientFilter()
}

const showIngredients = () => {
  ingredientListView.refreshSearchResults(ingredientFilterManager.displayList)
}

const processReview = (event) => {
  if (user === undefined) {
    // login fenster anzeigen
    loginView.initializeLoginView()
    loginView.showLoginView()
    loginView.addEventListener('USER_SUBMIT', (event) => {
      if (event.data[0] === undefined) {
        login.login(event.data[1], event.data[2])
      } else {
        login.singUp(event.data[0], event.data[1], event.data[2])
      }
    })
    return
  }
  if (reviewManager.isRatingValid(event.data.rating)) {
    user.makeRating(event.data.id, event.data.rating, event.data.review)
    // save review to db
    console.log(event.data.id, event.data.rating, event.data.review)
    cocktailListManager.getCocktailsFromDB()
    cocktailListManager.allCocktails.forEach(cocktail => {
      if (cocktail.id === event.data.id) {
        const cView = new CocktailView(cocktail, user)
        cView.fillHtml()
        cView.showCocktailPage()
        cView.addEventListener('REVIEW SUBMITTED', (event) => processReview(event))
        cocktailListManager.addEventListener('COCKTAIL_RATED', (event) => { cView.remove() })
        cView.addEventListener('COCKTAIL_FAV', (event) => user.addCocktailToFavorites(event.data))
        cView.addEventListener('COCKTAIL_UNFAV', (event) => user.deleteCocktailFromFavorites(event.data))
      }
    })
  }
}

listView.addEventListener('COCKTAIL CLICKED', (event) => {
  const cocktailView = new CocktailView(event.data, user)
  cocktailView.fillHtml()
  cocktailView.showCocktailPage()
  cocktailView.addEventListener('REVIEW SUBMITTED', (event) => processReview(event))
  cocktailListManager.addEventListener('COCKTAIL_RATED', (event) => { cocktailView.remove() })
  cocktailView.addEventListener('COCKTAIL_FAV', (event) => user.addCocktailToFavorites(event.data))
  cocktailView.addEventListener('COCKTAIL_UNFAV', (event) => user.deleteCocktailFromFavorites(event.data))
})

// input listeners
let timeout = null
const responseDelay = 500
// Listen for user input in Search Bar
// Also wait for user to finish input (.5s) to reduce amount of callbacks
const searchInput = document.querySelector('.search-bar-input')
searchInput.addEventListener('keyup', function () {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    cocktailListManager.searchCocktailByName(searchInput.value)
    addIngredientFilter()
  }, responseDelay)
})

// Listen for user input in Ingredient Filter Search Bar
// Also wait for user to finish input (.5s) to reduce amount of callbacks
const searchInputIngredient = document.querySelector('.ingredient-input')
searchInputIngredient.addEventListener('keyup', function () {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    ingredientFilterManager.searchIngredientByName(searchInputIngredient.value)
  }, responseDelay)
})

function addIngredientFilter () {
  if (user === undefined) {
    return
  }
  if (user.username !== undefined) {
    cocktailListManager.filterCocktailsByBannedIngredient(user.blackListedIngredients)
  }
}

addIngredientFilter()
