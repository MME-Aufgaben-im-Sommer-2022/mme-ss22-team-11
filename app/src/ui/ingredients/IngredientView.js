import {Observable, Event} from "../../utils/Observable.js";

const INGREDIENT_ELEMENT_TEMPLATE = document.getElementById("ingredient-element-template").innerHTML.trim();


function createIngredientElementForView() {
    let el = document.createElement("div");
    el.innerHTML = INGREDIENT_ELEMENT_TEMPLATE;
    return el.querySelector(".ingredient");
}

class IngredientView extends Observable {

    constructor(ingredient) {
        super();
        
        this.ingredient = ingredient;
        this.el = createIngredientElementForView();
        //this.el.textContent = ingredient.displayName;
        this.el.textContent = `Ing ${Math.floor(Math.random()*25)}`

        this.el.addEventListener("click", (event) => this.notifyAll(new Event("INGREDIENT CLICKED", [this.el, this.ingredient])));
    }

    appendTo(parent) {
        parent.append(this.el);
    }

    remove() {
        this.el.remove()
    }

}

export default IngredientView;