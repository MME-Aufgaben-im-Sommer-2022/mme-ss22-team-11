import { HtmlManipulator } from "./ui/RecipeHtmlManipulator.js";
import { CocktailListManager } from "./cocktailData/cocktailListManager.js";
import { IngredientFilterManager } from "./cocktailData/ingredientFilterManager.js";
import { ReviewManager } from "./cocktailData/reviewManager.js"
import { ListView } from "./ui/ListView.js";
import { IngredientListView } from "./ui/ingredients/IngredientListView.js";
import { CocktailView } from "./ui/cocktail/CocktailView.js";

let htmlManipulator = new HtmlManipulator;
let cocktailListManager = new CocktailListManager();
let ingredientFilterManager = new IngredientFilterManager();
let reviewManager = new ReviewManager();
let listView = new ListView();
let ingredientListView = new IngredientListView();

let showCocktails = () => {
    listView.refreshCocktails(cocktailListManager.displayList);
}

cocktailListManager.addEventListener("DATA_READY", (event) => showCocktails());
cocktailListManager.addEventListener("DATA_UPDATED", (event) => showCocktails());

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

let processReview = (event) => {
    if (reviewManager.isRatingValid(event.data['rating'])) {
        // save review+rating to db etc.
    }
}

listView.addEventListener("COCKTAIL CLICKED", (event) => {
    let cocktailView = new CocktailView(event.data);
    cocktailView.fillHtml();
    cocktailView.showCocktailPage();
    cocktailView.addEventListener("REVIEW SUBMITTED", (event) => processReview(event));
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
    }, responseDelay);
    
})