import { IngredientFilterManager } from "./cocktailData/ingredientFilterManager.js"
import { CreatorIngredientListView } from "./ui/ingredients/CreatorIngredientListView.js"

const IMAGE_INPUT = document.querySelector(".image-input")
const IMAGE_INPUT_LABEL = document.querySelector(".image-input-label")

const CREATOR_ING_CONTAINER = document.querySelector(".creator-ingredients-container")
const CREATOR_ING_INPUT_CONTAINER = document.querySelectorAll(".creator-ingredient-input-container")
const CREATOR_ING_RESULTS = document.querySelector(".creator-ingredient-input-results")
const CREATOR_ING_ADD = document.querySelector(".creator-ingredient-add")
const CREATOR_ING_RESULT_CONTAINER = document.querySelectorAll(".creator-ingredient-input-results")
const CREATOR_ING_TEMPLATE = document.querySelector("#creator-ingredient-template")

const CREATOR_INS_CONTAINER = document.querySelector(".creator-instructions-container")
const CREATOR_INS_INPUT_CONTAINER = document.querySelectorAll(".creator-instructions-input-container")
const CREATOR_INS_ADD = document.querySelector(".creator-instructions-add")

const CREATOR_ING_INPUT_CONTAINER_TEMPLATE = document.querySelector("#creator-ingredient-input-container-template").innerHTML.trim()
const CREATOR_INS_INPUT_CONTAINER_TEMPLATE = document.querySelector("#creator-instructions-input-container-template").innerHTML.trim()


function validateFileType(event) {
    var fileName = IMAGE_INPUT.value;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {

        let getImagePath = URL.createObjectURL(event.target.files[0]);
        IMAGE_INPUT_LABEL.style.background = `url(${getImagePath}) center`;
        IMAGE_INPUT_LABEL.style.backgroundSize = "cover";

        IMAGE_INPUT_LABEL.querySelector("img").remove();

    } else {
        alert("Only jpg/jpeg and png files are allowed!");
    }
}


IMAGE_INPUT.addEventListener("change", (event) => validateFileType(event))



function createIngredientInputContainer() {
    let el = document.createElement("div");
    el.innerHTML = CREATOR_ING_INPUT_CONTAINER_TEMPLATE;
    return el.querySelector(".creator-ingredient-input-container");
}

function createInstructionsInputContainer() {
    let el = document.createElement("div");
    el.innerHTML = CREATOR_INS_INPUT_CONTAINER_TEMPLATE;
    return el.querySelector(".creator-instructions-input-container");
}

/*
    INGREDIENTS
*/



function fillIngredientList(container, input) {
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


for (let i = 0; i < CREATOR_ING_INPUT_CONTAINER.length; i++) {
    CREATOR_ING_INPUT_CONTAINER[i].addEventListener("click", (event) => {
        if (CREATOR_ING_RESULTS.childElementCount != 0) {
            CREATOR_ING_INPUT_CONTAINER[i].classList.add("extend");
        } else {
            CREATOR_ING_INPUT_CONTAINER[i].classList.add("focus");
        }
    });
    document.addEventListener("click", (event) => {
        if (!CREATOR_ING_INPUT_CONTAINER[i].contains(event.target) && event.target.className != "creator-ingredient") {
            if (CREATOR_ING_INPUT_CONTAINER[i].classList.contains("focus")) {
                CREATOR_ING_INPUT_CONTAINER[i].classList.remove("focus");
            } else if (CREATOR_ING_INPUT_CONTAINER[i].classList.contains("extend")) {
                CREATOR_ING_INPUT_CONTAINER[i].classList.remove("extend");
            }
        }
    });

    /*
    FILL ING RESULTS
    */
    fillIngredientList(CREATOR_ING_INPUT_CONTAINER[i].querySelector(".creator-ingredient-input-results"), CREATOR_ING_INPUT_CONTAINER[i].querySelector(".creator-ingredient-input"));


    if (i != 0) {
        if (CREATOR_ING_INPUT_CONTAINER[i].querySelector(".creator-ingredient-input").textContent == "") {
            CREATOR_ING_INPUT_CONTAINER[i].querySelector(".creator-ingredient-input").addEventListener("keydown", (event) => {
                console.log(event.keyCode);
                if (event.keyCode == 8) {
                    console.log("DELETE");
                    CREATOR_ING_INPUT_CONTAINER[i].remove();
                }
            })
        }
    }
}


CREATOR_ING_ADD.addEventListener("click", (event) => {
    let newCreatorIngInputContainer = createIngredientInputContainer();
    CREATOR_ING_CONTAINER.insertBefore(newCreatorIngInputContainer, CREATOR_ING_CONTAINER.lastElementChild)

    newCreatorIngInputContainer.addEventListener("click", (event) => {
        if (CREATOR_ING_RESULTS.childElementCount != 0) {
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
    fillIngredientList(newCreatorIngInputContainer.querySelector(".creator-ingredient-input-results"), newCreatorIngInputContainer.querySelector(".creator-ingredient-input"));

})

/*
    INSTRUCTIONS
*/

for (let i = 0; i < CREATOR_INS_INPUT_CONTAINER.length; i++) {
    CREATOR_INS_INPUT_CONTAINER[i].addEventListener("click", (event) => {
        CREATOR_INS_INPUT_CONTAINER[i].classList.add("focus");
    });

    document.addEventListener("click", (event) => {
        if (!CREATOR_INS_INPUT_CONTAINER[i].contains(event.target) && CREATOR_INS_INPUT_CONTAINER[i].classList.contains("focus")) {
            CREATOR_INS_INPUT_CONTAINER[i].classList.remove("focus");
        }
    });

    if (i != 0) {
        CREATOR_INS_INPUT_CONTAINER[i].querySelector(".creator-instructions-input").addEventListener("keydown", (event) => {
            if (CREATOR_INS_INPUT_CONTAINER[i].querySelector(".creator-instructions-input").value == "" && event.keyCode == 8) {
                CREATOR_INS_INPUT_CONTAINER[i].remove()
            }
        })
    }
}


CREATOR_INS_ADD.addEventListener("click", (event) => {
    let newCreatorInsInputContainer = createInstructionsInputContainer();
    CREATOR_INS_CONTAINER.insertBefore(newCreatorInsInputContainer, CREATOR_INS_CONTAINER.lastElementChild)

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