// TODO Remove or refactor console logs before release
/* eslint-disable no-console */ 

import AppwriteConnector from "./appwrite/AppwriteConnector.js";

async function testAppwriteConnector() {
    let result, connector = new AppwriteConnector();

    // Testing account creation
    //console.log("Creating account");
    //let result = await connector.createAccount("A Test User", "a.test.user-v4@appwrite.com", "12345678");

    // Testing login
    console.log("Logging in with account");
    result = await connector.createSession("a.test.user-v3@appwrite.com", "12345678");
    console.log(result); // Current session

    // Testing preferences: Retrieving
    console.log("Retrieving preferences for currently logged in user");
    result = await connector.getPreferences();
    console.log(result); // Current preferences

    // Testing preferences: updating
    console.log("Updating (overwriting) preferences for current user");
    await connector.setPreferences({
        blacklistedIngredients: ["Sugar", "Milk", "Nuts"],
        favourites: ["22222", "11111", "33333"],
    });
    console.log("Retrieving updated preferences for currently logged in user");
    result = await connector.getPreferences();
    console.log(result); // Current preferences
}

testAppwriteConnector();

/*
import { HtmlManipulator } from "./ui/RecipeHtmlManipulator.js";
import { CocktailListManager } from "./cocktailData/cocktailListManager.js";
import { IngredientFilterManager } from "./cocktailData/ingredientFilterManager.js";
import { ListView } from "./ui/ListView.js";
import { IngredientListView } from "./ui/ingredients/IngredientListView.js";
import { CocktailView } from "./ui/cocktail/CocktailView.js";
import { User } from "./profile/user.js";
import { Login } from "./profile/login.js";



let htmlManipulator = new HtmlManipulator();
let cocktailListManager = new CocktailListManager();
let ingredientFilterManager = new IngredientFilterManager();
let listView = new ListView();
let ingredientListView = new IngredientListView();

let showCocktails = () => {
    listView.refreshCocktails(cocktailListManager.displayList);
}

//TODO: LOGIN (standarduser, der nix kann, sign/log-in)
// Login soll benutzt werden, um nutzer zu erstellen, abzurufen oder einen anonymen User zu erstellen
console.log("before: new Login()");

let login = new Login();
let user;
login.addEventListener("SIGN_UP", (event) => {
    user = event.data; 
    console.log(user);
});
login.singUp("Gix", "georg_dechant@web.de", "IchBinEinPasswort");

cocktailListManager.addEventListener("DATA_READY", (event) => showCocktails());
cocktailListManager.addEventListener("DATA_UPDATED", (event) => showCocktails());
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
}

let showIngredients = () => {
    ingredientListView.refreshSearchResults(ingredientFilterManager.displayList);
}


listView.addEventListener("COCKTAIL CLICKED", (event) => {
    let cocktailView = new CocktailView(event.data);
    cocktailView.fillHtml();
    cocktailView.showCocktailPage();
})

// input listeners
let timeout = null;
let responseDelay = 500;
// Listen for user input in Search Bar
// Also wait for user to finish input (.5s) to reduce amount of callbacks
let searchInput = document.querySelector('.search-bar-input');
searchInput.addEventListener('keyup', function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        cocktailListManager.searchCocktailByName(searchInput.value);
    }, responseDelay);

})

// Listen for user input in Ingredient Filter Search Bar
// Also wait for user to finish input (.5s) to reduce amount of callbacks
let searchInputIngredient = document.querySelector('.ingredient-input');
searchInputIngredient.addEventListener('keyup', function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        ingredientFilterManager.searchIngredientByName(searchInputIngredient.value)
    }, responseDelay);

})*/