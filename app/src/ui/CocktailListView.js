import { Observable, Event } from "../utils/Observable.js";

const COCKTAIL_LIST_VIEW_TEMPLATE_STRING = document.getElementById("cocktail-list-element-template").innerHTML.trim();

function createCocktailElementForView() {
    let el = document.createElement("div");
    el.innerHTML = COCKTAIL_LIST_VIEW_TEMPLATE_STRING;
    return el.querySelector(".cocktail")
}

function getIngredientsForList(ingredients) {
    if (ingredients.length >= 3) {
        return `${ingredients.splice(0, 2).join(", ")}, ...`;
    } else {
        return ingredients.join(", ");
    }
}

class CocktailListView extends Observable {

    constructor (cocktail) {
        super();
        
        this.cocktail = cocktail;
        this.el = createCocktailElementForView();
    }

    fillHtml() {
        this.el.querySelector("recipe-image").style.background = `url(${this.cocktail.image}) center`;
        this.el.querySelector("recipe-image").style.backgroundSize = "cover";

        this.el.querySelector("recipe-name").textContent = this.cocktail.name;
        this.el.querySelector("recipe-tags").textContent = `${this.cocktail.tags.join(", ")}`;
        this.el.querySelector("recipe-ingredients").textContent = getIngredientsForList(this.cocktail.ingredients);
    }

    appendTo(parent) {
        parent.append(this.el);
    }

    remove() {
        this.el.remove();
    }

}

export default CocktailListView;