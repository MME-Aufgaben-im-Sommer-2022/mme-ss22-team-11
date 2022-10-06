import CreatorIngredientView from "./CreatorIngredientView.js";
import {Observable, Event} from "../../utils/Observable.js";

class CreatorIngredientListView extends Observable {

    constructor(el, input) {
        super();

        this.searchResultList = [];

        this.el = el;
        this.input = input;
    }

    addToSearchResults(ingredient) {
        let ingredientView = new CreatorIngredientView(ingredient);

        ingredientView.appendTo(this.el);
        
        this.searchResultList.push(ingredientView);

        ingredientView.addEventListener("INGREDIENT CLICKED", (event) => {
            this.select(event.data[1]);
            this.notifyAll(new Event("INGREDIENT_SELECTED"));
        });
    }

    removeAllSearchResults() {
        this.searchResultList.forEach((view) => view.remove());
        this.searchResultList.splice(0, this.searchResultList.length);
    }

    addAllSearchResults(ingredients) {
        ingredients.forEach(ingredient => this.addToSearchResults(ingredient));
    }

    refreshSearchResults(ingredients) {
        this.removeAllSearchResults();
        this.addAllSearchResults(ingredients);
    }

    select(ingredient) {
        this.input.value = ingredient;
    }
}

export { CreatorIngredientListView };