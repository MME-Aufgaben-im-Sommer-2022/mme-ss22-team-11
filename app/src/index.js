
/*
    TODO: Put elsewhere (functions for the html css workings (e.g. animate ingredient-search))
*/

const NAV_LINKS = document.getElementsByClassName("nav-link");
const INGREDIENT_CONTAINER = document.getElementsByClassName("ingredients-container")[0];
const FILTER_CANCEL = document.getElementById("cancel-filter");
const FILTER_SECTION = document.getElementById("filter");
const FILTER_ING_INPUT_CONTAINER = document.getElementsByClassName("ingredient-input-container")[0];
const FILTER_ING_INPUT = document.getElementsByClassName("ingredient-input")[0];
const FILTER_ING_RESULTS = document.getElementsByClassName("ingredient-search-results")[0]
const RECIPES = document.getElementsByClassName("cocktail");

for (let item of NAV_LINKS) {
    item.addEventListener("click", (event) => {
        for (let item of NAV_LINKS) {
            if (item.classList.contains("active")) {
                item.classList.remove("active")
            }
        }
        item.classList.add("active")
    })
}

FILTER_ING_INPUT_CONTAINER.addEventListener("click", (event) => {
    if(FILTER_ING_RESULTS.childElementCount != 0) {
        FILTER_ING_INPUT_CONTAINER.classList.add("focused");
    }
})

document.addEventListener("click", (event) => {
    if (!FILTER_ING_INPUT_CONTAINER.contains(event.target) && event.target.className != "ingredient") {
        FILTER_ING_INPUT_CONTAINER.classList.remove("focused");
    }
})

for (let item of INGREDIENT_CONTAINER.children) {
    item.addEventListener("click", (event) => {
        item.remove();
    })
}

for (let item of FILTER_ING_RESULTS.children) {
    item.addEventListener("click", (event) => {
        item.remove();
        INGREDIENT_CONTAINER.append(item);
    })
}

/*
    TODO: Delete (this is only for testing purposes)
*/

class Recipe {

    constructor(name, ingredients, tags, image) {
        this.name = name;
        this.ingredients = ingredients;
        this.tags = tags;
        this.image = image;
    }

    createRecipeEntry(recipeEl) {
        recipeEl.getElementsByClassName("cocktail-image")[0].style.background = `url(${this.image}) center`;
        recipeEl.getElementsByClassName("cocktail-image")[0].style.backgroundSize = "cover";
        recipeEl.getElementsByClassName("cocktail-name")[0].textContent = this.name;
        recipeEl.getElementsByClassName("cocktail-tags")[0].textContent = `${this.tags.join(", ")}`;
        recipeEl.getElementsByClassName("cocktail-ingredients")[0].textContent = `${this.ingredients.splice(0, 2).join(", ")}, ..`;
    }
}

let testRecipe1 = new Recipe("Caipirinha", ["Cachaca", "Limette", "Rohrzucker", "Crushed Ice"], ["Frisch", "Spritzig", "Sauer"], "https://images.lecker.de/,id=34833bed,b=lecker,w=610,cg=c.jpg");
testRecipe1.createRecipeEntry(RECIPES[0]);

let testRecipe2 = new Recipe("Mojito", ["Rum", "Soda", "Limette", "Crushed Ice", "Brauner Zucker", "Minze"], ["Frisch", "Minzig"], "https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/ras/Assets/3279978A-FC6C-4231-A42C-DF759994C99C/Derivates/4278FB29-8E6B-4986-BF60-231C91231A01.jpg");
testRecipe2.createRecipeEntry(RECIPES[1]);

let testRecipe3 = new Recipe("Old Fashioned", ["Whiskey", "Zuckersirup", "Angostura Bitters", "Orange"], ["Kräftig", "Stark"], "https://images.ichkoche.at/data/image/variations/496x384/14/old-fashioned-rezept-img-137843.jpg");
testRecipe3.createRecipeEntry(RECIPES[2]);
