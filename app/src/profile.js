import { CocktailListManager } from "./cocktailData/cocktailListManager.js";
import { User } from "./profile/user.js";
import { HtmlManipulator } from "./ui/ProfileHtmlManipulator.js";
import { CocktailView } from "./ui/cocktail/CocktailView.js";
import CocktailListView from "./ui/CocktailListView.js";
import { Login } from "./profile/login.js";
import { BannedIngredientsView } from "./ui/profile/BannedIngredientsView.js";
import { IngredientFilterManager } from "./cocktailData/ingredientFilterManager.js";
import { ReviewSectionView } from "./ui/profile/ReviewSectionView.js"

const FAVORITE_CONTAINER = document.querySelector(".cocktail-container");

let htmlManipulator = new HtmlManipulator(),
  favorites = [],
  login = new Login(),
  user = login.getDefaultUser();

let userData = JSON.parse(localStorage.getItem("USER"));
user.username = userData.username;
user.email = userData.email;
user.createdCocktails = userData.createdCocktails;
user.favorites = userData.favorites;
user.blackListedIngredients = userData.blackListedIngredients;
user.givenRatings = userData.givenRatings;


let cocktailListManager = new CocktailListManager(),
  bannedIngredientsView = new BannedIngredientsView(user.blackListedIngredients),
  ingredientFilterManager = new IngredientFilterManager(),
  reviewSectionView = new ReviewSectionView();

cocktailListManager.getCocktailsFromDB();

localStorage.clear();
user.addEventListener("USER_DATA_CHANGED", (event) => login.updateUser(event.data));
user.addEventListener("DELETE_RATING", (event) => cocktailListManager.deleteRating(event.data));

//cocktailListManager.addEventListener("DATA_READY", showFavorites());

// banned ing search
let showIngredients = () => {
  bannedIngredientsView.refreshSearchResults(ingredientFilterManager.displayList);
}
ingredientFilterManager.addEventListener("INGREDIENT_DATA_READY", () => showIngredients());
ingredientFilterManager.addEventListener("INGREDIENT_DATA_UPDATED", () => showIngredients());

bannedIngredientsView.addEventListener("INGREDIENT_SELECTED", (event) => {
  console.log("add to blacklisted", event.data)
  user.addIngredientToBlackList(event.data);
});
bannedIngredientsView.addEventListener("INGREDIENT_UNSELECTED", (event) => {
  console.log("remove to blacklisted", event.data)
  user.deleteIngredientFromBlackList(event.data);
});

let timeout = null,
  responseDelay = 500;

let searchInput = bannedIngredientsView.el.querySelector('.search-ingredient');
searchInput.addEventListener('keyup', function () {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    ingredientFilterManager.searchIngredientByName(searchInput.value);
  }, responseDelay);
});

bannedIngredientsView.showBannedIngredients();

htmlManipulator.addEventListener("CHANGE_PROFILE_CONTENT", (event) => {
  if (event.data == "banned-ingredients") {
    bannedIngredientsView.showBannedIngredients();
  //} else if (event.data == "created-cocktails") {
  //  console.log("created-cocktails");
  } else {
    reviewSectionView.showReviewSection();
    reviewSectionView.refreshReviews(getReviews());
    reviewSectionView.addEventListener("RATING_DELETION", (event) => {
      user.deleteRating(event.data.cocktail.id);
    });
  }
});

document.querySelector("#recipes-link").addEventListener("click", (event) => {
  user.listener = {};
  user.allIngredients = {};
  localStorage.setItem("USER", JSON.stringify(user));
  window.open("./index.html", "_self");
});

/*
TODO: login fenster:
    darin login / signup methoden

    Buttonlistener für deletefavs, blacklist, bewertungen anzeigen
*/

// Get Favorites & Delete 1 Favorite


function getFavorites() {
  return cocktailListManager.getFavorites(user.favorites);
}


function deleteFavorite(cocktailId) {
  user.deleteCocktailFromFavorites(cocktailId);
}

// Load Favorites in Profile UI


function fillFavorites(favorites) {
  favorites.array.forEach(cocktail => {
    let favoriteList = new CocktailListView(cocktail);
    favoriteList.appendTo(FAVORITE_CONTAINER);
  });
}

function showFavorites() {
  let favorites = getFavorites();
  fillFavorites(favorites);
}

// Get Reviews & Delete 1  Review

function getReviews() {
  let lst = [];

  user.givenRatings.forEach(data => {
    let obj = {};
    console.log(cocktailListManager);
    let cocktail = cocktailListManager.getCocktailForID(data.cocktailID);
    obj.cocktail = cocktail;
    obj.rating = data.rating;
    lst.push(obj);
  });

  return lst;

}


function deleteReview(cocktailID) {
  user.deleteRating(cocktailID);
}


// User created Cocktails

function getUserCreatedCocktails() {
  return cocktailListManager.getFavorites(user.createdCocktails);
}



// Load Reviews in Profile UI

function fillReviews() {
  let reviews = getReviews();
  return reviews;
}

function showReviews() {
  let reviews = fillReviews();
  reviews.forEach(review => {
    let reviewView = new ProfileReviewView(review);
    reviewView.appendTo();
  });
}