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
    for (let index = 1; index <= Object.keys(instructions).length; index++) {
        let li = document.createElement("li");
        li.textContent = instructions[index];
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

function initializeFavEventListeners(favButton, cocktailView) {
    favButton.addEventListener("mouseover", (event) => {
        favButton.src = "./resources/css/img/VectorFavHover.svg";
    });
    favButton.addEventListener("mouseout", (event) => {
        if(favButton.classList.contains("active")) {
            favButton.src = "./resources/css/img/VectorFavFilled.svg";
        } else {
            favButton.src = "./resources/css/img/VectorFavHollow.svg";
        }
    });
    favButton.addEventListener("click", (event) => {
        if(favButton.classList.contains("active")) {
            favButton.classList.remove("active");
            favButton.src = "./resources/css/img/VectorFavHollow.svg";
        } else {
            favButton.classList.add("active");
            favButton.src = "./resources/css/img/VectorFavFilled.svg";
        }
    })
}

function initializeRatingEventListeners(ratingInput, reviewInput, sendButton, cocktailView) {
    let stars = ratingInput.querySelectorAll("img");
    stars = Array.from(stars);
    let rating = 0;
    
    stars.forEach(element => {
        element.addEventListener("click", () => {
            rating = stars.indexOf(element) + 1;
            for (let i = 0; i < stars.indexOf(element) + 1; i++) {
                stars[i].src = "./resources/css/img/VectorStarFilledAccent.svg";
            }
            for (let i = stars.indexOf(element) + 1; i < 5; i++) {
                stars[i].src = "./resources/css/img/VectorStarHollowAccent.svg";
            }
        })
    });
    sendButton.addEventListener("click", () => {
        let review = reviewInput.value;
        cocktailView.notifyAll(new Event("REVIEW SUBMITTED", {rating, review}));
    })
    
}

class CocktailView extends Observable {

    constructor(cocktail) {
        super();
        this.cocktail = cocktail;

        this.el = createCocktailPageElement();
        window.scrollTo(0,0);
    }

    fillHtml() {
        this.el.querySelector(".cocktail-image").style.background = `url(${this.cocktail.image}) center`;
        this.el.querySelector(".cocktail-image").style.backgroundSize = "cover";

        //TODO: Change this when tags aren't empty any more
        //this.el.querySelector(".tags").textContent = this.cocktail.tags;
        this.el.querySelector(".tags").textContent = "TAGS TAGS TAGS";
        
        this.el.querySelector(".name").textContent = this.cocktail.name;

        let backButton = this.el.querySelector(".cocktail-back");
        let favButton = this.el.querySelector(".cocktail-fav");
        let ratingInput = this.el.querySelector(".rating-input");
        let reviewInput = this.el.querySelector(".review-input");
        let sendButton = this.el.querySelector(".send-icon");

        initializeBackEventListeners(backButton, this);
        initializeFavEventListeners(favButton, this);
        initializeRatingEventListeners(ratingInput, reviewInput, sendButton, this);

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