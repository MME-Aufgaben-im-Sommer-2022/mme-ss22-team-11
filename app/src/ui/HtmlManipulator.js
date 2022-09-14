const NAV_LINKS = document.getElementsByClassName("nav-link");
const INGREDIENT_CONTAINER = document.getElementsByClassName("ingredients-container")[0];
const FILTER_CANCEL = document.getElementById("cancel-filter");
const FILTER_SECTION = document.getElementById("filter");
const FILTER_ING_INPUT_CONTAINER = document.getElementsByClassName("ingredient-input-container")[0];
const FILTER_ING_INPUT = document.getElementsByClassName("ingredient-input")[0];
const FILTER_ING_RESULTS = document.getElementsByClassName("ingredient-search-results")[0]
const RECIPES = document.getElementsByClassName("cocktail");

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
    }
}

export default HtmlManipulator;