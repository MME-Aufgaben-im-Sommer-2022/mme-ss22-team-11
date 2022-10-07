import { Observable, Event } from "../../utils/Observable.js";
import IngredientView from "../ingredients/IngredientView.js";

const PROFILE_BANNED_INGS_TEMPLATE = document.getElementById("banned-ingredients-section-template")
  .innerHTML.trim();

const BANNED_INGS_CONTAINER = document.querySelector(".banned-ingredients-container"),
    SEARCH_RESULTS_CONTAINER = document.querySelector(".search-results-container"),
    SETTINGS_FRAME = document.querySelector(".settings-frame"),
    searchResultViewList = [],
    bannedIngsViewList = [];

function createProfileBannedIngsElement() {
  let el = document.createElement("div");
  el.innerHTML = PROFILE_BANNED_INGS_TEMPLATE;
  return el.querySelector(".banned-ingredients-section");
}

class BannedIngredientsView extends Observable {

    constructor(bannedIngredients) {
        super();
        this.el = createProfileBannedIngsElement();
        this.bannedIngsContainer = this.el.querySelector(".banned-ingredients-container");
        this.searchResultsContainer = this.el.querySelector(".search-results-container");
        this.bannedIngredients = [];

        bannedIngredients.forEach(ingredient => {
            this.addToBannedIngs(ingredient);
        });

        //this.settingsFrame = this.el.querySelector(".settings-frame");
    }

    showBannedIngredients() {
        SETTINGS_FRAME.innerHTML = "";
        SETTINGS_FRAME.append(this.el);
    }

    addToSearchResults(ingredient) {
        let ingredientView = new IngredientView(ingredient);
        ingredientView.appendTo(this.searchResultsContainer);
        searchResultViewList.push(ingredientView);

        ingredientView.addEventListener("INGREDIENT CLICKED", (event) => {
            if (this.bannedIngredients.indexOf(ingredient) == -1) {
                this.addToBannedIngs(ingredient)
                this.notifyAll(new Event("INGREDIENT_SELECTED", ingredient));
            }
        })
    }

    addAllSearchResults(ingredients) {
        ingredients.forEach(ingredient => this.addToSearchResults(ingredient));
    }

    
    removeAllSearchResults() {
        searchResultViewList.forEach((view) => view.remove());
        searchResultViewList.splice(0, searchResultViewList.length);
    }
    
    refreshSearchResults(ingredients) {
        let sortedIngredients = ingredients.sort((a, b) => a.localeCompare(b));
        this.removeAllSearchResults();
        this.addAllSearchResults(sortedIngredients);
    }
    
    addToBannedIngs(ingredient) {
        this.bannedIngredients.push(ingredient);
        let ingredientView = new IngredientView(ingredient);
        ingredientView.appendTo(this.bannedIngsContainer);
        bannedIngsViewList.push(ingredientView);

        ingredientView.addEventListener("INGREDIENT CLICKED", () => {
            ingredientView.remove();
            this.notifyAll(new Event("INGREDIENT_UNSELECTED", ingredient));
        })
    }

    getAllBannedIngs() {
        return bannedIngsViewList;
    }

}

export { BannedIngredientsView };