import { CocktailListManager } from "./cocktailData/cocktailListManager.js";
import { User } from "./profile/user.js";
import { HtmlManipulator } from "./ui/ProfileHtmlManipulator.js";
import ProfileReviewView from "./ui/profile/ProfileReviewView.js";
import { CocktailView } from "./ui/cocktail/CocktailView.js";
import CocktailListView from "./ui/CocktailListView.js";
import { Login } from "./profile/login.js";

const FAVORITE_CONTAINER = document.querySelector(".cocktail-container");

let htmlManipulator = new HtmlManipulator(),
  user = new User(),
  favorites = [],
  login = new Login(),
  cocktailListManager = new CocktailListManager();

  console.log(localStorage.getItem("USER"));

  let userData = JSON.parse(localStorage.getItem("USER"));
  user.username = userData.username;
  user.email = userData.email;
  user.createdCocktails = userData.createdCocktails;
  user.favorites = userData.favorites;
  user.blackListedIngredients = userData.blackListedIngredients;
  user.givenRatings = userData.givenRatings;

  localStorage.clear();
  console.log(localStorage.getItem("USER"));
  user.addEventListener("USER_DATA_CHANGED", (event) => login.updateUser(event.data));

//cocktailListManager.addEventListener("DATA_READY", showFavorites());


document.querySelector("#recipes-link").addEventListener("click", (event) => {
  user.listener = {};
  user.allIngredients = {};
  console.log(user);
  localStorage.setItem("USER", JSON.stringify(user));
  window.open("../../index.html", "_self");
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
  favorites = getFavorites();
  fillFavorites(favorites);
}

// Add Blacklist Ingredient & Delete Blacklist Ingredient

function addBlacklistIngredient(displayName) {
  user.addBlacklistIngredient(displayName);
}

function removeBlacklistIngredient(displayName) {
  user.removeBlacklistIngredient(displayName);
}

// Get Reviews & Delete 1  Review

function getReviews() {
  return user.getRatings();
}

function deleteReview (cocktailID) {
  user.deleteRating();
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