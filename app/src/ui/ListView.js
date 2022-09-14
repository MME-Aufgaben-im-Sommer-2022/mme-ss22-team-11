import CocktailListView from "./CocktailListView.js";
import { Observable, Event } from "../utils/Observable.js";

const cocktailListViews = [];

class ListView extends Observable {

    constructor() {
        super();
    }

    add(cocktail) {

        let cocktailListView = new CocktailListView(cocktail);
        cocktailListView.fillHtml();
        cocktailListView.appendTo(document.querySelector(".cocktail-container"));

        console.log(cocktailListView);

        cocktailListViews.push(cocktailListView);
    }

    removeAllCocktails() {
        cocktailListViews.forEach((view) => view.remove());
        cocktailListViews.splice(0, cocktailListViews.length)
    }

    addAllCocktails(cocktails) {
        cocktails.forEach(cocktail => this.add(cocktail));
    }

    refreshCocktails(cocktails) {
        this.removeAllCocktails();
        this.addAllCocktails(cocktails);
    }
}

export { ListView };