import { Observable, Event } from "../../utils/Observable.js";
import { IngredientView } from "../ingredients/IngredientView.js";

const PROFILE_BANNED_INGS_TEMPLATE = document.getElementById("banned-ingredients-section-template")
  .innerHTML.trim();

const BANNED_INGS_CONTAINER = document.querySelector(".banned-ingredients-container"),
    SEARCH_RESULTS_CONTAINER = document.querySelector(".search-results-container"),
    searchResultList = [],
    bannedIngsList = [];

function createProfileBannedIngsElement() {
  let el = document.createElement("div");
  el.innerHTML = PROFILE_BANNED_INGS_TEMPLATE;
  return el.querySelector(".banned-ingredients-section");
}

class BannedIngredientsView extends Observable {

    constructor() {
        super();
        this.el = createProfileBannedIngsElement();

    }

    fillHtml() {
        //el.querySelector(".banned-ingredients-container")
        //el.querySelector(".search-results-container")
        document.querySelector(".banned-ingredients-container").append(this.el);
    }

    showBannedIngredients() {
        
    }

    addToSearchResults(ingredient) {
        let ingredientView = new IngredientView();
        ingredientView.appendTo(SEARCH_RESULTS_CONTAINER);
        searchResultList.push(ingredientView);

        ingredientView.addEventListener("INGREDIENT CLICKED", (event) => {
            console.log("SEARCH INGREDIENT CLICKED");
        })
    }

    addAllSearchResults(ingredients) {
        ingredients.forEach(ingredient => this.addToSearchResults(ingredient));
    }

    
    removeAllSearchResults() {
        searchResultList.forEach((view) => view.remove());
        searchResultList.splice(0, searchResultList.length);
    }
    
    refreshSearchResults(ingredients) {
        this.removeAllSearchResults();
        this.addAllSearchResults(ingredients);
    }
    
    addToBannedIngs(ingredient) {
        let ingredientView = new IngredientView();
        ingredientView.appendTo(BANNED_INGS_CONTAINER);
        bannedIngsList.push(ingredientView);

        ingredientView.addEventListener("INGREDIENT CLICKED", (event) => {
            console.log("BANNED INGREDIENT CLICKED");
        })
    }

    getAllBannedIngs() {
        return bannedIngsList;
    }

}

export { BannedIngredientsView };