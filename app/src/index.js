import { HtmlManipulator } from "./ui/HtmlManipulator.js";
import { CocktailListManager } from "./cocktailData/cocktailListManager.js";
import { IngredientFilterManager } from "./cocktailData/ingredientFilterManager.js";
import { ListView } from "./ui/ListView.js";
import { IngredientListView } from "./ui/ingredients/IngredientListView.js";
import { CocktailView } from "./ui/cocktail/CocktailView.js";

let htmlManipulator = new HtmlManipulator;
let cocktailListManager = new CocktailListManager();
let ingredientFilterManager = new IngredientFilterManager();
let listView = new ListView();
let ingredientListView = new IngredientListView();

let showCocktails = () => {
    // let ingredientList = [];
    // ingredientList.push("Rum (weiß)");
    // cocktailListManager.getCocktailsWithIngredients(ingredientList);
    listView.refreshCocktails(cocktailListManager.displayList);
}

cocktailListManager.addEventListener("DATA_READY", (event) => showCocktails());
cocktailListManager.addEventListener("DATA_UPDATED", (event) => showCocktails());

// Rewrite URL
//window.history.pushState('Rezepte', 'Rezepte', '/Rezepte');

// Ingredient Filter
ingredientFilterManager.addEventListener("INGREDIENT_DATA_READY", (event) => showIngredients());
ingredientFilterManager.addEventListener("INGREDIENT_DATA_UPDATED", (event) => showIngredients());
/* TODO: 
ingredientFilterManager.addEventListener("INGREDIENT_SELECTED", (event) => showCocktailsFiltered())

let showCocktailsFiltered = () => {
    let selected = ingredientListView.getAllSelected();
    console.log(selected)
    cocktailListManager.getCocktailsWithIngredients(selected, false);
    listView.refreshCocktails(cocktailListManager.displayList);
}
*/

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
searchInput.addEventListener('keyup', function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        cocktailListManager.searchCocktailByName(searchInput.value);
    }, responseDelay);
    
})

// Listen for user input in Ingredient Filter Search Bar
// Also wait for user to finish input (.5s) to reduce amount of callbacks
let searchInputIngredient = document.querySelector('.ingredient-input');
searchInputIngredient.addEventListener('keyup', function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        ingredientFilterManager.searchIngredientByName(searchInputIngredient.value)
        console.log(searchInputIngredient.value)
    }, responseDelay);
    
})