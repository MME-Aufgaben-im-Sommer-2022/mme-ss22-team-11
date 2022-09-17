import { HtmlManipulator } from "./ui/HtmlManipulator.js";
import { CocktailListManager } from "./cocktailData/cocktailListManager.js";
import { ListView } from "./ui/ListView.js";
import { IngredientListView } from "./ui/ingredients/IngredientListView.js";
import { CocktailView } from "./ui/cocktail/CocktailView.js";

let htmlManipulator = new HtmlManipulator;
let cocktailListManager = new CocktailListManager();
let listView = new ListView();
let ingredientListView = new IngredientListView();

let showCocktails = () => {
    // let ingredientList = [];
    // ingredientList.push("Rum (weiß)");
    // cocktailListManager.getCocktailsWithIngredients(ingredientList);
    listView.refreshCocktails(cocktailListManager.displayList);
}

cocktailListManager.addEventListener("DATA_READY", (event) => showCocktails());

// Rewrite URL
//window.history.pushState('Rezepte', 'Rezepte', '/Rezepte');

let test = [1, 2, 3, 4, 5];

ingredientListView.refreshSearchResults(test);
ingredientListView.refreshSelected(test);


listView.addEventListener("COCKTAIL CLICKED", (event) => {
    let cocktailView = new CocktailView(event.data);
    cocktailView.fillHtml();
    cocktailView.showCocktailPage();
})