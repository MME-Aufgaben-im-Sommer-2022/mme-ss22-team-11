import Observable from "../utils/Observable.js";
import { Ingredient, IngredientList, CustomIngredientMaker } from "./ingredient.js";

class IngredientFilterManager extends Observable {

    constructor() {
        super();

        this.ingredientList = new IngredientList();
        
        this.getIngredientData();

        this.displayList = this.ingredientList.displayNames;
    }

    // fetch ingredients from JSON
    getIngredientData() {
        fetch("./src/cocktailData/JSON/ingredients.json")
            .then((response) => response.json())
            .then((json) => {

                for (let i in json) {

                    let data = json[i],
                        alcoholic = data.alcoholic == 1;
                    this.ingredientList.addIngredient(new Ingredient(i, data.display_name, alcoholic));
                    if (!this.ingredientList.displayNames.includes(data.display_name)) {
                        this.ingredientList.addIngredientDisplay(data.display_name)
                    }
                }

                this.notifyAll(new Event("INGREDIENT_DATA_READY"));
            });
    }

    getIngredientDisplayNames() {
        let returnList = [];
        this.ingredientList.displayNames.forEach(ingredient => {
            returnList.push(ingredient);
        });

        return returnList;
    }

    updateDisplayList(returnList) {
        this.displayList = returnList;
        this.notifyAll(new Event("INGREDIENT_DATA_UPDATED"));
    }

    searchIngredientByName(query) {
        let returnList = [];
        this.ingredientList.displayNames.forEach(ingredient => {
            // make ingredient name & query lowercase for comparing
            let name = ingredient.toLowerCase();
            query = query.toLowerCase();
            if (name.startsWith(query)) {
                returnList.push(ingredient);
            }
        });
        this.updateDisplayList(returnList);
    }

}

export { IngredientFilterManager };