import { HtmlManipulator } from "./ui/RecipeHtmlManipulator.js";
import { CocktailListManager } from "./cocktailData/cocktailListManager.js";
import { IngredientFilterManager } from "./cocktailData/ingredientFilterManager.js";
import { ListView } from "./ui/ListView.js";
import { IngredientListView } from "./ui/ingredients/IngredientListView.js";
import { CocktailView } from "./ui/cocktail/CocktailView.js";
import { User } from "./profile/user.js";
import { Login } from "./profile/login.js";
import { CocktailCreator } from "./cocktailData/cocktailCreator.js";

let htmlManipulator = new HtmlManipulator(),
    cocktailListManager = new CocktailListManager(),
    ingredientFilterManager = new IngredientFilterManager(),
    listView = new ListView(),
    ingredientListView = new IngredientListView(),
    cocktailCreator = new CocktailCreator(),
    showCocktails = () => {
    listView.refreshCocktails(cocktailListManager.displayList);
},  
    login = new Login(),
    user;

//TODO: LOGIN (standarduser, der nix kann, sign/log-in)
// Login soll benutzt werden, um nutzer zu erstellen, abzurufen oder einen anonymen User zu erstellen

login.addEventListener("LOGIN", (event) => {
    user = event.data;
    user.addEventListener("USER_DATA_CHANGED", (event) => login.updateUser(event.data));
    console.log(user);
});

// testing:
// login.singUp("Gix", "georg_dechant@web.de", "IchBinEinPasswort");
// login.login("georg_dechant@web.de", "IchBinEinPasswort");

cocktailListManager.addEventListener("DATA_READY", (event) => showCocktails());
cocktailListManager.addEventListener("DATA_UPDATED", (event) => showCocktails());
cocktailListManager.addEventListener("READY_FOR_COCKTAILS", (event) => cocktailListManager.onReadyForCocktails());
// user.addEventListener("RATING_READY", (event) => cocktailListManager.rateCocktail(event.data));

// Rewrite URL
//window.history.pushState('Rezepte', 'Rezepte', '/Rezepte');

// Ingredient Filter
ingredientFilterManager.addEventListener("INGREDIENT_DATA_READY", (event) => showIngredients());
ingredientFilterManager.addEventListener("INGREDIENT_DATA_UPDATED", (event) => showIngredients());

ingredientListView.addEventListener("INGREDIENT_SELECTED", (event) => filterCocktails())
ingredientListView.addEventListener("INGREDIENT_UNSELECTED", (event) => filterCocktails())

let filterCocktails = () => {
    let selected = ingredientListView.getAllSelected();
    cocktailListManager.getCocktailsWithIngredients(selected, false);
},
showIngredients = () => {
    ingredientListView.refreshSearchResults(ingredientFilterManager.displayList);
};

listView.addEventListener("COCKTAIL CLICKED", (event) => {
    let cocktailView = new CocktailView(event.data);
    cocktailView.fillHtml();
    cocktailView.showCocktailPage();
});

// input listeners
let timeout = null,
    responseDelay = 500;
// Listen for user input in Search Bar
// Also wait for user to finish input (.5s) to reduce amount of callbacks
let searchInput = document.querySelector('.search-bar-input');
searchInput.addEventListener('keyup', function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        cocktailListManager.searchCocktailByName(searchInput.value);
    }, responseDelay);

});

// Listen for user input in Ingredient Filter Search Bar
// Also wait for user to finish input (.5s) to reduce amount of callbacks
let searchInputIngredient = document.querySelector('.ingredient-input');
searchInputIngredient.addEventListener('keyup', function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        ingredientFilterManager.searchIngredientByName(searchInputIngredient.value);
    }, responseDelay);

});