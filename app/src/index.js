import HtmlManipulator from "./ui/HtmlManipulator.js";
import { CocktailListManager } from "./cocktailData/cocktailListManager.js";
import { ListView } from "./ui/ListView.js";

let htmlManipulator = new HtmlManipulator;
let cocktailListManager = new CocktailListManager();
let listView = new ListView();

let showCocktails = () => {
    // let ingredientList = [];
    // ingredientList.push("Rum (weiß)");
    // cocktailListManager.getCocktailsWithIngredients(ingredientList);
    listView.refreshCocktails(cocktailListManager.displayList);
}

cocktailListManager.addEventListener("DATA_READY", (event) => showCocktails());