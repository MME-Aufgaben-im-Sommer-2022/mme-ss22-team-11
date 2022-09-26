import IngredientView from "./IngredientView.js";
import {Observable, Event} from "../../utils/Observable.js";

const searchResultList = [];
const selectedList = [];

const SEARCH_RESULTS_CONTAINER = document.getElementsByClassName("ingredient-search-results")[0];
const SELECTED_CONTAINER = document.getElementsByClassName("ingredients-container")[0];

class IngredientListView extends Observable {

    constructor() {
        super();
    }

    addToSearchResults(ingredient) {
        let ingredientView = new IngredientView(ingredient);
        ingredientView.appendTo(SEARCH_RESULTS_CONTAINER);
        
        searchResultList.push(ingredientView);

        ingredientView.addEventListener("INGREDIENT CLICKED", (event) => {
            this.addToSelected(event.data[1]);
            this.notifyAll(new Event("INGREDIENT_SELECTED"))
        })
    }

    removeAllSearchResults() {
        searchResultList.forEach((view) => view.remove());
        searchResultList.splice(0, searchResultList.length)
    }

    addAllSearchResults(ingredients) {
        ingredients.forEach(ingredient => this.addToSearchResults(ingredient));
    }

    refreshSearchResults(ingredients) {
        this.removeAllSearchResults();
        this.addAllSearchResults(ingredients);
    }


    addToSelected(ingredient) {
        let ingredientView = new IngredientView(ingredient);
        ingredientView.appendTo(SELECTED_CONTAINER);

        selectedList.push(ingredientView);

        ingredientView.addEventListener("INGREDIENT CLICKED", (event) => {
            event.data[0].remove();
            selectedList.splice(selectedList.indexOf(ingredientView), 1);
            this.addToSearchResults(ingredient);
            this.notifyAll(new Event("INGREDIENT_UNSELECTED"))
        })
    }

    /*
    removeAllSelected() {
        selectedList.forEach((view) => view.remove());
        selectedList.splice(0, selectedList.length)
    }

    addAllSelected(ingredients) {
        ingredients.forEach(ingredient => this.addToSelected(ingredient));
    }

    refreshSelected(ingredients) {
        this.removeAllSelected();
        this.addAllSelected(ingredients);
    }
    */

    getAllSelected() {
        return selectedList;
    }

}

export { IngredientListView };