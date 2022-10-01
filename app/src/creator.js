import { CocktailCreator } from "./cocktailData/cocktailCreator.js";
import { IngredientFilterManager } from "./cocktailData/ingredientFilterManager.js";
import { HtmlManipulator } from "./ui/CreatorHtmlManipulator.js";
import { IngredientListView } from "./ui/ingredients/IngredientListView.js";

let htmlManipulator = new HtmlManipulator();
let ingredientListView = new IngredientListView();
let ingredientFilterManager = new IngredientFilterManager();
let cocktailCreator = new CocktailCreator();


/** Ingredient Filter **/
ingredientFilterManager.addEventListener("INGREDIENT_DATA_READY", (event) => showIngredients());
ingredientFilterManager.addEventListener("INGREDIENT_DATA_UPDATED", (event) => showIngredients());

ingredientListView.addEventListener("INGREDIENT_SELECTED", (event) => {})
ingredientListView.addEventListener("INGREDIENT_UNSELECTED", (event) => {})

let showIngredients = () => {
    ingredientListView.refreshSearchResults(ingredientFilterManager.displayList);
};

// Listen for user input in Ingredient Filter Search Bar
// Also wait for user to finish input (.5s) to reduce amount of callbacks
let timeout = null,
    responseDelay = 500;
let searchInputIngredient = document.querySelector('.ingredient-input');
searchInputIngredient.addEventListener('keyup', function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        ingredientFilterManager.searchIngredientByName(searchInputIngredient.value);
    }, responseDelay);

});