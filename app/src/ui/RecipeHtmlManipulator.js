const NAV_LINKS = document.getElementsByClassName("nav-link");
const INGREDIENT_CONTAINER = document.getElementsByClassName("ingredients-container")[0];
const FILTER_SECTION = document.getElementById("filter");
const FILTER_ING_INPUT_CONTAINER = document.getElementsByClassName("ingredient-input-container")[0];
const FILTER_ING_INPUT = document.getElementsByClassName("ingredient-input")[0];
const FILTER_ING_RESULTS = document.getElementsByClassName("ingredient-search-results")[0];
const NEW_RECIPE_FAB = document.getElementsByClassName("new-recipe-fab")[0];

class HtmlManipulator {

    constructor () {
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
                FILTER_ING_INPUT_CONTAINER.classList.add("extend");
            } else {
                FILTER_ING_INPUT_CONTAINER.classList.add("focus");
            }
        })
        
        document.addEventListener("click", (event) => {
            if (!FILTER_ING_INPUT_CONTAINER.contains(event.target) && event.target.className != "ingredient") {
                if(FILTER_ING_INPUT_CONTAINER.classList.contains("focus")) {
                    FILTER_ING_INPUT_CONTAINER.classList.remove("focus");
                } else if (FILTER_ING_INPUT_CONTAINER.classList.contains("extend")) {
                    FILTER_ING_INPUT_CONTAINER.classList.remove("extend");
                }
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
        
        NEW_RECIPE_FAB.addEventListener("mouseover", (event) => {
            NEW_RECIPE_FAB.children[0].src = "./resources/css/img/VectorPlusPrimary.svg";
        })
        
        NEW_RECIPE_FAB.addEventListener("mouseout", (event) => {
            NEW_RECIPE_FAB.children[0].src = "./resources/css/img/VectorPlusAccent.svg";
        })
        
        NEW_RECIPE_FAB.addEventListener("click", (event) => {
            console.log("open recipe-creator");
        })
    }
}

export { HtmlManipulator };