import Observable from "../utils/Observable.js";
import { CocktailListManager } from "./cocktailListManager.js";

class CocktailCreator extends Observable {

    constructor() {
        super();
        this.cocktailListManager = new CocktailListManager();
    }

    // collect data from all input fields when submit button is clicked
    processUserInput(data) {
        if (this.isValid()) {

            let recipe = {};
            recipe.mainIngredients = [];
            recipe.decoIngredients = [];

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