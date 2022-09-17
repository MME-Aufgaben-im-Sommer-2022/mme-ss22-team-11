import {Observable, Event} from "../../utils/Observable.js";

const COCKTAIL_PAGE_TEMPLATE = document.getElementById("cocktail-section-element-template").innerHTML.trim();

function createCocktailPageElement() {
    let el = document.createElement("div");
    el.innerHTML = COCKTAIL_PAGE_TEMPLATE;
    return el.querySelector(".cocktail-section")
}

function createIngredients(el, ingredients) {
    ingredients.forEach(element => {
        let li = document.createElement("li");
        li.textContent = `${element.ingredient.displayName} ${element.portion}${element.unit}`;
        el.querySelector(".ingredients").append(li);
    });
}

function createInstructions(el, instructions) {
    for (var step in instructions) {
        let li = document.createElement("li");
        li.textContent = step;
        el.querySelector(".instructions").append(li);
    }
}

function initializeBackEventListeners(backButton, cocktailView) {
    backButton.addEventListener("mouseover", (event) => {
        backButton.src = "./resources/css/img/VectorBackHover.svg";
    });
    backButton.addEventListener("mouseout", (event) => {
        backButton.src = "./resources/css/img/VectorBack.svg";
    });
    backButton.addEventListener("click", (event) => {
        cocktailView.remove();
    })
}

class CocktailView extends Observable {

    constructor(cocktail) {
        super();
        this.cocktail = cocktail;

        this.el = createCocktailPageElement();
    }

    fillHtml() {
        this.el.querySelector(".cocktail-image").style.background = `url(${this.cocktail.image}) center`;
        this.el.querySelector(".cocktail-image").style.backgroundSize = "cover";

        //TODO: Change this when tags aren't empty any more
        //this.el.querySelector(".tags").textContent = this.cocktail.tags;
        this.el.querySelector(".tags").textContent = "TAGS TAGS TAGS";
        
        this.el.querySelector(".name").textContent = this.cocktail.name;

        let backButton = this.el.querySelector(".cocktail-back");
        initializeBackEventListeners(backButton, this);

        console.log(this.cocktail.recipe);

        createIngredients(this.el, this.cocktail.recipe.mainIngredients);
        createInstructions(this.el, this.cocktail.steps);
    }

    showCocktailPage() {
        document.querySelector("#filter").style.display = "none";
        document.querySelector(".cocktails").style.display = "none";
        document.querySelector("body").append(this.el);
    }

    remove() {
        this.el.remove();
        document.querySelector("#filter").style.display = "flex";
        document.querySelector(".cocktails").style.display = "block";
    }

}

export {CocktailView};