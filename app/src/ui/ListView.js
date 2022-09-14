import CocktailListView from "./CocktailListView";
import { Observable, Event } from "../utils/Observable.js";

const cocktailListViews = [];

class ListView extends Observable {

    constructor () {
        super();
    }

    add(cocktail) {
        let cocktailListView = new CocktailListView(cocktail);
        cocktailListView.fillHtml();
        cocktailListView.appendTo(document.querySelector(".cocktail-container"))

        cocktailListViews.push(cocktailListView);
    }

    removeAllCocktails() {
        cocktailListViews.forEach((view) => view.remove());
        cocktailListViews.splice(0, cocktailListViews.length)
    }

    //addAll and refresh?
}

export default ListView;