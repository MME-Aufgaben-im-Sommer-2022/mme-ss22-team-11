import AppwriteConnector from "../appwrite/AppwriteConnector.js";
import { Observable, Event } from "../utils/Observable.js";

const COCKTAIL_LIST_VIEW_TEMPLATE_STRING = document.getElementById("cocktail-list-element-template").innerHTML.trim();

function createCocktailElementForView() {
    let el = document.createElement("div");
    el.innerHTML = COCKTAIL_LIST_VIEW_TEMPLATE_STRING;
    return el.querySelector(".cocktail");
}

function getIngredientsForList(ingredients) {
    // eslint-disable-next-line no-magic-numbers
    if (ingredients.length >= 3) {
        // eslint-disable-next-line no-magic-numbers
        return `${ingredients.splice(0, 2).join(", ")}, ...`;
    } 
    return ingredients.join(", ");
    
}

class CocktailListView extends Observable {

    constructor (cocktail) {
        super();
        
        this.appwrite = new AppwriteConnector();
        this.cocktail = cocktail;
        this.el = createCocktailElementForView();

        this.el.addEventListener("click", () => this.notifyAll(new Event("COCKTAIL CLICKED", this.cocktail)));
    }

    async fillHtml() {

        if (this.cocktail.isMarked) {
            // markieren, weil mindestens eine Zutat ersetzt werden muss
            this.el.classList.add("substitute");
        }

        if (this.cocktail.image === "NO_IMAGE") {
            // TODO: Bild für nix da
        } else if (this.cocktail.image === "STORAGE") {
            let data = await this.appwrite.getFile(this.cocktail.id);
            this.el.querySelector(".cocktail-image").style.background = `url(${data.href}) center`;
        } else {
            this.el.querySelector(".cocktail-image").style.background = `url(${this.cocktail.image}) center`;
        }
        
        this.el.querySelector(".cocktail-image").style.backgroundSize = "cover";

        this.el.querySelector(".cocktail-name").textContent = this.cocktail.name;
        this.el.querySelector(".cocktail-tags").textContent = `${this.cocktail.tags.join(", ")}`;

        let displayNames = this.cocktail.getAllDisplayNames();

        this.el.querySelector(".cocktail-ingredients").textContent = getIngredientsForList(displayNames);
    }

    appendTo(parent) {
        parent.append(this.el);
    }

    remove() {
        this.el.remove();
    }

}

export default CocktailListView;