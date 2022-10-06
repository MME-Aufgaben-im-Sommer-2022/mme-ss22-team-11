import Observable from "../utils/Observable.js";
import { Ingredient, IngredientList, CustomIngredientMaker } from "./ingredient.js";

class IngredientFilterManager extends Observable {

    constructor() {
        super();

        this.ingredientList = new IngredientList();
        this.allIngredients = []
        this.displayList = [];
        
        this.getIngredientData();
        
    }


    getIngredientData() {
        fetch("./src/cocktailData/JSON/displayNames.json")
            .then((response) => response.json())
            .then((json) => {

                for (let i in json) {
                    this.allIngredients.push(i);
                    this.displayList.push(i);
                }

                this.notifyAll(new Event("INGREDIENT_DATA_READY"));

            })
    }


    updateDisplayList(returnList) {
        this.displayList = returnList;
        this.notifyAll(new Event("INGREDIENT_DATA_UPDATED"));
    }

    searchIngredientByName(query) {

        let returnList = [];
        this.allIngredients.forEach(ingredient => {
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