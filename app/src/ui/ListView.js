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

        cocktailListViews.push(cocktailListView);

        cocktailListView.addEventListener("COCKTAIL CLICKED", (event) => this.notifyAll(new Event("COCKTAIL CLICKED", event.data)));
    }

    removeAllCocktails() {
        cocktailListViews.forEach((view) => view.remove());
        cocktailListViews.splice(0, cocktailListViews.length);
    }

    addAllCocktails(cocktails, markedIDs) {
        cocktails.forEach(cocktail => {
            if (markedIDs.indexOf(cocktail.id) == -1) {
                cocktail.isMarked = false;
            } else {
                cocktail.isMarked = true;
            }
            this.add(cocktail);
        });
    }

    refreshCocktails(cocktails, markedIDs) {
        this.removeAllCocktails();
        this.addAllCocktails(cocktails, markedIDs);
    }
}

export { ListView };