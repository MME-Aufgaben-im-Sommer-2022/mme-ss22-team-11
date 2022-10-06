import { CocktailListManager } from "./cocktailData/cocktailListManager.js";
import { Login } from "./profile/login.js";
import { User } from "./profile/user.js";
import { HtmlManipulator } from "./ui/ProfileHtmlManipulator.js";
import ProfileReviewView from "./ui/profile/ProfileReviewView.js";
import { CocktailView } from "./ui/cocktail/CocktailView.js";
import CocktailListView from "./ui/CocktailListView.js";

const FAVORITE_CONTAINER = document.querySelector(".cocktail-container");

let htmlManipulator = new HtmlManipulator(),
  user,
  login = new Login(),
  cocktailListManager = new CocktailListManager();

login.addEventListener("LOGIN", (event) => {
  user = event.data;
  user.addEventListener("USER_DATA_CHANGED", (event) =>
    login.updateUser(event.data));
  user.addEventListener("DELETE_RATING", (event) => {
    cocktailListManager.deleteCocktailRating(event.data);
  });
});

cocktailListManager.addEventListener("DATA_READY", showFavorites());

/*
TODO: login fenster
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

// Load Reviews in Profile UI

function fillReviews() {
  let reviews = getReviews();
}

function showReviews() {
  let reviews = this.fillReviews();
  reviews.forEach(review => {
    let reviewView = new ProfileReviewView(review);
    reviewView.appendTo("parent");
  });
}