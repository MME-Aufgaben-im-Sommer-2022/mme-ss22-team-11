import { CocktailListManager } from "./cocktailData/cocktailListManager.js";
import { IngredientFilterManager } from "./cocktailData/ingredientFilterManager.js";
import { ListView } from "./ui/ListView.js";
import { IngredientListView } from "./ui/ingredients/IngredientListView.js";
import { CocktailView } from "./ui/cocktail/CocktailView.js";
import { LoginView } from "./ui/LoginView.js";
import { Login } from "./profile/login.js";

// eslint-disable-line no-use-before-define

let cocktailListManager = new CocktailListManager(),
  ingredientFilterManager = new IngredientFilterManager(),
  listView = new ListView(),
  ingredientListView = new IngredientListView(),
  loginView = new LoginView(),
  showCocktails = () => {
    listView.refreshCocktails(cocktailListManager.displayList);
  },
  login = new Login(),
  user,
  filterCocktails = () => {
    let selected = ingredientListView.getAllSelected();
    cocktailListManager.getCocktailsWithIngredients(selected, false);
  },
  showIngredients = () => {
    ingredientListView.refreshSearchResults(ingredientFilterManager
    .displayList);
  },
  timeout = null,
  responseDelay = 500,
  searchInput = document.querySelector(".search-bar-input"),
  searchInputIngredient = document.querySelector(".ingredient-input");


/*
    Functions for using the LoginView
*/

/*
loginView.initializeLoginView();
loginView.showLoginView();
loginView.addEventListener("USER_SUBMIT", (event) => {
    console.log(event.data[0]);
    // TODO: work with user input here
    // if event.data[0] is undefined -> user wants to login
})
*/



//TODO: LOGIN (standarduser, der nix kann, sign/log-in)
// Login soll benutzt werden, um nutzer zu erstellen, abzurufen oder einen anonymen User zu erstellen

login.login("masterofzago@gmail.com", "12345678");
// 
login.addEventListener("LOGIN", (event) => {
  user = event.data;
  user.addEventListener("USER_DATA_CHANGED", (event) => login.updateUser(
    event.data));
  user.addEventListener("RATING_READY", (event) => {
    cocktailListManager.rateCocktail(event.data);
  });
});

// TODO: rating abgeben über knopf oder so
// user.makeRating(cocktailID, stars, text);

cocktailListManager.addEventListener("DATA_READY", () => showCocktails());
cocktailListManager.addEventListener("DATA_UPDATED", () =>
showCocktails());
cocktailListManager.addEventListener("READY_FOR_COCKTAILS", () =>
  cocktailListManager.onReadyForCocktails());
// user.addEventListener("RATING_READY", (event) => cocktailListManager.rateCocktail(event.data));

// Rewrite URL
//window.history.pushState('Rezepte', 'Rezepte', '/Rezepte');

// Ingredient Filter
ingredientFilterManager.addEventListener("INGREDIENT_DATA_READY", () =>
  showIngredients());
ingredientFilterManager.addEventListener("INGREDIENT_DATA_UPDATED", () =>
  showIngredients());

ingredientListView.addEventListener("INGREDIENT_SELECTED", () =>
  filterCocktails());
ingredientListView.addEventListener("INGREDIENT_UNSELECTED", () =>
  filterCocktails());

listView.addEventListener("COCKTAIL CLICKED", (event) => {
  let cocktailView = new CocktailView(event.data);
  cocktailView.fillHtml();
  cocktailView.showCocktailPage();
});

// input listeners
// Listen for user input in Search Bar
// Also wait for user to finish input (.5s) to reduce amount of callbacks
searchInput.addEventListener("keyup", function() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    cocktailListManager.searchCocktailByName(searchInput.value);
  }, responseDelay);

});

// Listen for user input in Ingredient Filter Search Bar
// Also wait for user to finish input (.5s) to reduce amount of callbacks
searchInputIngredient.addEventListener("keyup", function() {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    ingredientFilterManager.searchIngredientByName(searchInputIngredient
      .value);
  }, responseDelay);

});