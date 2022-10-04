import { CocktailListManager } from "./cocktailData/cocktailListManager.js";
import { Login } from "./profile/login.js";
import { User } from "./profile/user.js";
import { HtmlManipulator } from "./ui/ProfileHtmlManipulator.js";

let htmlManipulator = new HtmlManipulator,
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