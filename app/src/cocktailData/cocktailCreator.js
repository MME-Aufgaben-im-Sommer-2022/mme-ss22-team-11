import Observable from "../utils/Observable.js";
import { CocktailListManager } from "./cocktailListManager.js";
import { Recipe } from "./recipe.js";

const cocktailSubmit = document.querySelector('.creator-upload-button');

class CocktailCreator extends Observable {

    constructor() {
        super();
        this.cocktailListManager = new CocktailListManager();
        this.listen();
    }

    listen() {
        cocktailSubmit.addEventListener("click", () => {
            this.processInput();
        });
    }

    collectInput() {
        let name = document.getElementById("name").value;

        let stepList = []
        let steps = document.querySelector(".creator-steps").getElementsByClassName("creator-step-input");
        for (let i = 0; i < steps.length; i++) {
            stepList.push(steps[i].value);
        }
        
        let ingredientList = [];
        let ingredients = document.querySelector(".ingredients-container").getElementsByClassName("ingredient");
        for (let i = 0; i < ingredients.length; i++) {
            ingredientList.push({"name": ingredients[i].innerHTML, "amount": undefined, "unit": undefined});
        }
        


        let data = {name, stepList, ingredientList}
        return data;
    }

    // collect data from all input fields when submit button is clicked
    processInput() {
        
        let data = this.collectInput();

        console.log(data)

        if (this.isValid()) {

            let recipe = new Recipe();

            this.cocktailListManager.addCustomCocktail("name", recipe, "jannis.jpg", [], "", "", "");
            
        } else {
            console.log("cocktail creation failed: invalid input");
        }

        //console.log(items)
    }

    // TODO: perform check if submitted cocktail details are existent+valid
    isValid() {

        return true;
    }

}

export { CocktailCreator };