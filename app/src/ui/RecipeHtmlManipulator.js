// import { CocktailCreator } from "../cocktailData/cocktailCreator.js";
import { Observable, Event} from "../utils/Observable.js";

const NAV_LINKS = document.getElementsByClassName("nav-link"),
    INGREDIENT_CONTAINER = document.getElementsByClassName("ingredients-container")[0],
    // FILTER_SECTION = document.getElementById("filter"),
    FILTER_ING_INPUT_CONTAINER = document.getElementsByClassName("ingredient-input-container")[0],
    // FILTER_ING_INPUT = document.getElementsByClassName("ingredient-input")[0],
    FILTER_ING_RESULTS = document.getElementsByClassName("ingredient-search-results")[0],
    NEW_RECIPE_FAB = document.getElementsByClassName("new-recipe-fab")[0],
    FAV_SEARCH = document.getElementsByClassName("search-fav")[0];

class HtmlManipulator extends Observable {

    constructor() {

        super();
        
        for (let item of NAV_LINKS) {
            item.addEventListener("click", () => {
                for (let item of NAV_LINKS) {
                    if (item.classList.contains("active")) {
                        item.classList.remove("active");
                    }
                }
                item.classList.add("active");
            });
        }

        FILTER_ING_INPUT_CONTAINER.addEventListener("click", () => {
            if (FILTER_ING_RESULTS.childElementCount !== 0) {
                FILTER_ING_INPUT_CONTAINER.classList.add("extend");
            } else {
                FILTER_ING_INPUT_CONTAINER.classList.add("focus");
            }
        });

        document.addEventListener("click", (event) => {
            if (!FILTER_ING_INPUT_CONTAINER.contains(event.target) && event.target.className !== "ingredient") {
                if (FILTER_ING_INPUT_CONTAINER.classList.contains("focus")) {
                    FILTER_ING_INPUT_CONTAINER.classList.remove("focus");
                } else if (FILTER_ING_INPUT_CONTAINER.classList.contains("extend")) {
                    FILTER_ING_INPUT_CONTAINER.classList.remove("extend");
                }
            }
        });

        for (let item of INGREDIENT_CONTAINER.children) {
            item.addEventListener("click", () => {
                item.remove();
            });
        }

        for (let item of FILTER_ING_RESULTS.children) {
            item.addEventListener("click", () => {
                item.remove();
                INGREDIENT_CONTAINER.append(item);
            });
        }

        if (NEW_RECIPE_FAB !== undefined) {
            NEW_RECIPE_FAB.addEventListener("mouseover", () => {
                NEW_RECIPE_FAB.children[0].src = "./resources/css/img/VectorPlusPrimary.svg";
            });

            NEW_RECIPE_FAB.addEventListener("mouseout", () => {
                NEW_RECIPE_FAB.children[0].src = "./resources/css/img/VectorPlusAccent.svg";
            });

            NEW_RECIPE_FAB.addEventListener("click", () => {
                this.notifyAll(new Event("COCKTAILCREATOR"));
            });
        }

        FAV_SEARCH.addEventListener("mouseover", (event) => {
            FAV_SEARCH.children[0].src = "./resources/css/img/VectorFavHover.svg";
        })
        
        FAV_SEARCH.addEventListener("mouseout", (event) => {
            FAV_SEARCH.children[0].src = "./resources/css/img/VectorFavHollow.svg";
        })
        
        FAV_SEARCH.addEventListener("click", (event) => {
            if (FAV_SEARCH.classList.contains("active")) {
                FAV_SEARCH.children[0].src = "./resources/css/img/VectorFavHollow.svg";
                FAV_SEARCH.classList.remove("active");
                this.notifyAll(new Event("FAV_SEARCH", "DEACTIVATED"));
            } else {
                FAV_SEARCH.children[0].src = "./resources/css/img/VectorFavFilled.svg";
                FAV_SEARCH.classList.add("active")
                this.notifyAll(new Event("FAV_SEARCH", "ACTIVATED"));
            }
        })
    }
}

export { HtmlManipulator };