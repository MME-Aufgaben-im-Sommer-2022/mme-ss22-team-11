import Observable from "../utils/Observable.js";
import { CocktailListManager } from "./cocktailListManager.js";
import { Recipe } from "./recipe.js";

import { IngredientFilterManager } from "./ingredientFilterManager.js"
import { CreatorIngredientListView } from "../ui/ingredients/CreatorIngredientListView.js"




const COCKTAIL_CREATOR_TEMPLATE = document.getElementById("recipe-creator-section-template").innerHTML.trim();


class CocktailCreator extends Observable {






    constructor() {
        super();

        this.cocktailListManager = new CocktailListManager();

        this.IMAGE_INPUT;
        this.IMAGE_INPUT_LABEL;
        this.CREATOR_ING_CONTAINER;
        this.CREATOR_ING_INPUT_CONTAINER;
        this.CREATOR_ING_RESULTS;
        this.CREATOR_ING_ADD;
        this.CREATOR_ING_RESULT_CONTAINER;
        this.CREATOR_ING_TEMPLATE;
        this.CREATOR_INS_CONTAINER;
        this.CREATOR_INS_INPUT_CONTAINER;
        this.CREATOR_INS_ADD;
        this.CREATOR_ING_INPUT_CONTAINER_TEMPLATE;
        this.CREATOR_INS_INPUT_CONTAINER_TEMPLATE;
        this.CREATOR_SUMBIT;

    }

    initializeCreator() {
        document.querySelector("#filter").style.display = "none";
        document.querySelector(".cocktails").style.display = "none";
        document.querySelector("body").append(this.createCocktailCreator());

        this.IMAGE_INPUT = document.querySelector(".image-input")
        this.IMAGE_INPUT_LABEL = document.querySelector(".image-input-label")
        this.CREATOR_ING_CONTAINER = document.querySelector(".creator-ingredients-container")
        this.CREATOR_ING_INPUT_CONTAINER = document.querySelectorAll(".creator-ingredient-input-container")
        this.CREATOR_ING_RESULTS = document.querySelector(".creator-ingredient-input-results")
        this.CREATOR_ING_ADD = document.querySelector(".creator-ingredient-add")
        this.CREATOR_ING_RESULT_CONTAINER = document.querySelectorAll(".creator-ingredient-input-results")
        this.CREATOR_ING_TEMPLATE = document.querySelector("#creator-ingredient-template")
        this.CREATOR_INS_CONTAINER = document.querySelector(".creator-instructions-container")
        this.CREATOR_INS_INPUT_CONTAINER = document.querySelectorAll(".creator-instructions-input-container")
        this.CREATOR_INS_ADD = document.querySelector(".creator-instructions-add")
        this.CREATOR_ING_INPUT_CONTAINER_TEMPLATE = document.querySelector("#creator-ingredient-input-container-template").innerHTML.trim()
        this.CREATOR_INS_INPUT_CONTAINER_TEMPLATE = document.querySelector("#creator-instructions-input-container-template").innerHTML.trim()
        this.CREATOR_SUMBIT = document.querySelector(".submit-button")

        this.IMAGE_INPUT.addEventListener("change", (event) => this.validateFileType(event));

        this.CREATOR_SUMBIT.addEventListener("click", () => {
            this.processInput();
        });

        this.initializeIngredientInputContainer();
        this.initializeInstructionInputContainer();
    }

    createCocktailCreator() {
        let el = document.createElement("div");
        el.innerHTML = COCKTAIL_CREATOR_TEMPLATE;
        el = el.querySelector(".recipe-creator-section");
        el.querySelector(".creator-cancel").addEventListener("click", (event) => {
            el.remove();
            document.querySelector("#filter").style.display = "flex";
            document.querySelector(".cocktails").style.display = "block";
        })
        return el;
    }

    /* 
        INIT 
    */

    validateFileType(event) {
        var fileName = this.IMAGE_INPUT.value;
        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {

            let getImagePath = URL.createObjectURL(event.target.files[0]);
            this.IMAGE_INPUT_LABEL.style.background = `url(${getImagePath}) center`;
            this.IMAGE_INPUT_LABEL.style.backgroundSize = "cover";

            this.IMAGE_INPUT_LABEL.querySelector("img").remove();

        } else {
            alert("Only jpg/jpeg and png files are allowed!");
        }
    }

    createIngredientInputContainer() {
        let el = document.createElement("div");
        el.innerHTML = this.CREATOR_ING_INPUT_CONTAINER_TEMPLATE;
        return el.querySelector(".creator-ingredient-input-container");
    }

    createInstructionsInputContainer() {
        let el = document.createElement("div");
        el.innerHTML = this.CREATOR_INS_INPUT_CONTAINER_TEMPLATE;
        return el.querySelector(".creator-instructions-input-container");
    }

    /*
        INGREDIENTS
    */

    fillIngredientList(container, input) {
        let ingredientFilterManager = new IngredientFilterManager();
        let ingredientListView = new CreatorIngredientListView(container, input);

        ingredientFilterManager.addEventListener("INGREDIENT_DATA_READY", () => {
            ingredientListView.refreshSearchResults(ingredientFilterManager.displayList);
        });

        ingredientFilterManager.addEventListener("INGREDIENT_DATA_UPDATED", () => {
            ingredientListView.refreshSearchResults(ingredientFilterManager.displayList);
        });

        // search functionality
        let timeout = null,
            responseDelay = 500;

        input.addEventListener('keyup', function () {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                ingredientFilterManager.searchIngredientByName(input.value);
            }, responseDelay);

        });

        ingredientListView.addEventListener("INGREDIENT_SELECTED", function () {
            ingredientFilterManager.searchIngredientByName(input.value);
        });
    }

    initializeIngredientInputContainer() {
        for (let i = 0; i < this.CREATOR_ING_INPUT_CONTAINER.length; i++) {
            this.CREATOR_ING_INPUT_CONTAINER[i].addEventListener("click", (event) => {
                if (this.CREATOR_ING_RESULTS.childElementCount != 0) {
                    this.CREATOR_ING_INPUT_CONTAINER[i].classList.add("extend");
                } else {
                    this.CREATOR_ING_INPUT_CONTAINER[i].classList.add("focus");
                }
            });
            document.addEventListener("click", (event) => {
                if (!this.CREATOR_ING_INPUT_CONTAINER[i].contains(event.target) && event.target.className != "creator-ingredient") {
                    if (this.CREATOR_ING_INPUT_CONTAINER[i].classList.contains("focus")) {
                        this.CREATOR_ING_INPUT_CONTAINER[i].classList.remove("focus");
                    } else if (this.CREATOR_ING_INPUT_CONTAINER[i].classList.contains("extend")) {
                        this.CREATOR_ING_INPUT_CONTAINER[i].classList.remove("extend");
                    }
                }
            });

            /*
            FILL ING RESULTS
            */

            this.fillIngredientList(this.CREATOR_ING_INPUT_CONTAINER[i].querySelector(".creator-ingredient-input-results"), this.CREATOR_ING_INPUT_CONTAINER[i].querySelector(".creator-ingredient-input"));


            if (i != 0) {
                if (this.CREATOR_ING_INPUT_CONTAINER[i].querySelector(".creator-ingredient-input").textContent == "") {
                    this.CREATOR_ING_INPUT_CONTAINER[i].querySelector(".creator-ingredient-input").addEventListener("keydown", (event) => {
                        console.log(event.keyCode);
                        if (event.keyCode == 8) {
                            console.log("DELETE");
                            this.CREATOR_ING_INPUT_CONTAINER[i].remove();
                        }
                    })
                }
            }
        }


        this.CREATOR_ING_ADD.addEventListener("click", (event) => {
            let newCreatorIngInputContainer = this.createIngredientInputContainer();
            this.CREATOR_ING_CONTAINER.insertBefore(newCreatorIngInputContainer, this.CREATOR_ING_CONTAINER.lastElementChild)

            newCreatorIngInputContainer.addEventListener("click", (event) => {
                if (this.CREATOR_ING_RESULTS.childElementCount != 0) {
                    newCreatorIngInputContainer.classList.add("extend");
                } else {
                    newCreatorIngInputContainer.classList.add("focus");
                }
            });
            document.addEventListener("click", (event) => {
                if (!newCreatorIngInputContainer.contains(event.target) && event.target.className != "creator-ingredient") {
                    if (newCreatorIngInputContainer.classList.contains("focus")) {
                        newCreatorIngInputContainer.classList.remove("focus");
                    } else if (newCreatorIngInputContainer.classList.contains("extend")) {
                        newCreatorIngInputContainer.classList.remove("extend");
                    }
                }
            });

            newCreatorIngInputContainer.querySelector(".creator-ingredient-input").addEventListener("keydown", (event) => {
                if (newCreatorIngInputContainer.querySelector(".creator-ingredient-input").value == "" && event.keyCode == 8) {
                    newCreatorIngInputContainer.remove()
                }
            })

            /*
            FILL ING RESULTS
            */
            this.fillIngredientList(newCreatorIngInputContainer.querySelector(".creator-ingredient-input-results"), newCreatorIngInputContainer.querySelector(".creator-ingredient-input"));

        })

    }

    /*
        INSTRUCTIONS
    */

    initializeInstructionInputContainer() {
        for (let i = 0; i < this.CREATOR_INS_INPUT_CONTAINER.length; i++) {
            this.CREATOR_INS_INPUT_CONTAINER[i].addEventListener("click", (event) => {
                this.CREATOR_INS_INPUT_CONTAINER[i].classList.add("focus");
            });

            document.addEventListener("click", (event) => {
                if (!this.CREATOR_INS_INPUT_CONTAINER[i].contains(event.target) && this.CREATOR_INS_INPUT_CONTAINER[i].classList.contains("focus")) {
                    this.CREATOR_INS_INPUT_CONTAINER[i].classList.remove("focus");
                }
            });

            if (i != 0) {
                this.CREATOR_INS_INPUT_CONTAINER[i].querySelector(".creator-instructions-input").addEventListener("keydown", (event) => {
                    if (this.CREATOR_INS_INPUT_CONTAINER[i].querySelector(".creator-instructions-input").value == "" && event.keyCode == 8) {
                        this.CREATOR_INS_INPUT_CONTAINER[i].remove()
                    }
                })
            }
        }


        this.CREATOR_INS_ADD.addEventListener("click", (event) => {
            let newCreatorInsInputContainer = this.createInstructionsInputContainer();
            this.CREATOR_INS_CONTAINER.insertBefore(newCreatorInsInputContainer, this.CREATOR_INS_CONTAINER.lastElementChild)

            newCreatorInsInputContainer.addEventListener("click", (event) => {
                newCreatorInsInputContainer.classList.add("focus");
            });

            document.addEventListener("click", (event) => {
                if (!newCreatorInsInputContainer.contains(event.target) && newCreatorInsInputContainer.classList.contains("focus")) {
                    newCreatorInsInputContainer.classList.remove("focus");
                }
            });

            newCreatorInsInputContainer.querySelector(".creator-instructions-input").addEventListener("keydown", (event) => {
                if (newCreatorInsInputContainer.querySelector(".creator-instructions-input").value == "" && event.keyCode == 8) {
                    newCreatorInsInputContainer.remove()
                }
            })
        })
    }

    /* 
        INPUT PROCESSING
    */

    collectInput() {
        let name = document.querySelector(".name-input").value;

        let image = document.querySelector(".image-input").value;

        let tagList = [];
        let tags = document.getElementsByClassName("creator-tag selected");
        for (let i = 0; i < tags.length; i++) {
            tagList.push(tags[i].innerHTML);
        }

        let ingredientList = [];
        let ingredients = document.getElementsByClassName("creator-ingredient-input");
        let ingredientsQuantity = document.getElementsByClassName("creator-ingredient-quantity-input");
        for (let i = 0; i < ingredients.length; i++) {
            ingredientList.push({ "name": ingredients[i].value, "amount": ingredientsQuantity[i].value, "unit": undefined });
        }

        let stepList = []
        let steps = document.getElementsByClassName("creator-instructions-input");
        for (let i = 0; i < steps.length; i++) {
            stepList.push(steps[i].value);
        }

        let data = { name, image, tagList, stepList, ingredientList }
        return data;
    }

    // collect data from all input fields when submit button is clicked
    processInput() {
        let data = this.collectInput();

        if (this.isValid(data)) {

            let name = data.name;
            let image = data.image;
            let tags = data.tagList;
            let recipe = new Recipe();

            let ingredients = data.ingredientList;
            ingredients.forEach((ingredient) => {
                recipe.addMainIngredient(ingredient.name, ingredient.amount, ingredient.unit);
            })

            let steps = data.stepList;

            this.cocktailListManager.addCustomCocktail(name, recipe, image, tags, "", steps, "");

        } else {
            alert("Cocktail Creation failed: Invalid Input");
        }
    }

    // perform check if submitted cocktail details are existent+valid
    isValid(data) {

        if (data.name == "") return false;

        let hasValidIngredient = true;
        data.ingredientList.forEach((ingredient) => {
            if (ingredient.name == "") hasValidIngredient = false;
            if (ingredient.amount == "") hasValidIngredient = false;
            //if (ingredient.unit == "") hasValidIngredient = false;
        })
        if (!hasValidIngredient) return false;

        let hasValidStep = true;
        data.stepList.forEach((step) => {
            if (step == "") hasValidStep = false;
        })
        if (!hasValidStep) return false;

        return true;
    }

}

export { CocktailCreator };