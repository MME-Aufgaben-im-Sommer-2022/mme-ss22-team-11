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

    addAllCocktails(cocktails, markedIDs, substitutedIngredients) {
        cocktails.forEach(cocktail => {
            if (markedIDs.indexOf(cocktail.id) == -1) {
                cocktail.isMarked = false;
            } else {
                cocktail.isMarked = true;
            }

            cocktail.toBeSubbed = [];

            if (substitutedIngredients != undefined) {
                cocktail.recipe.mainIngredients.forEach(component => {
                    if (substitutedIngredients.indexOf(component.ingredient.displayName) != -1) {
                        cocktail.toBeSubbed.push(component.ingredient.displayName);
                    }
                });
            }

            this.add(cocktail);
        });
    }

    refreshCocktails(cocktails, markedIDs, substitutedIngredients) {
        this.removeAllCocktails();
        this.addAllCocktails(cocktails, markedIDs, substitutedIngredients);
    }
}

export { ListView };