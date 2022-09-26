import { Observable, Event } from "../utils/Observable.js";

class Ingredient {

    constructor(name, displayName, alcoholic) {
        this.name = name;
        this.displayName = displayName;
        this.alcoholic = alcoholic;
        this.replacements = [];
        this.isCustomIngredient = false;
    }

    setReplacements(replacements) {
        this.replacements = replacements;
    }

}

class CustomIngredientMaker {

    constructor() { }

    makeCustomIngredient(name, alcoholic) {
        let ingredient = new Ingredient(name, name, alcoholic);
        ingredient.isCustomIngredient = true;
        return ingredient;
    }

}

class IngredientList extends Observable {

    constructor() {

        super();
        this.list = [];

        // Später für Zutatsauswahl (filter, usw)
        this.displayNames = [];
    }

    getAllIngredientsFromJSON() {

        let ingredients = [];
        let lst = new IngredientList();

        fetch('./src/cocktailData/JSON/ingredients.json')
            .then((response) => response.json())
            .then((json) => {

                for (let i in json) {

                    let data = json[i];
                    ingredients.push(new Ingredient(i, data.display_name, data.alcoholic));


                }


                ingredients.forEach(ingredient => lst.addIngredient(ingredient));
                this.notifyAll(new Event("INGREDIENTS_READY", ingredients));



            });
    }

    addIngredient(ingredient) {
        this.list.push(ingredient);
    }

    addIngredientDisplay(ingredient) {
        this.displayNames.push(ingredient);
    }

    //TODO: aktualisieren auf die csv
    // Um Alle Ingredients mit selben displayName zu kriegen (wird vielleicht gebraucht)
    getAllIngredientsForDisplayName(query) {

        let returnList = [];

        this.list.forEach(ingredient => {
            if (ingredient.displayName === query) {
                returnList.push(ingredient);
            }
        })

        return returnList;
    }

    isIngredientAlcoholic(query) {

        let alcoholic = false;

        this.list.forEach(ingredient => {
            if (ingredient.name === query) {
                alcoholic = ingredient.alcoholic;
            }
        });
        return alcoholic;
    }

    getDisplayNameFromName(query) {

        let returnString = query;

        this.list.forEach(ingredient => {

            if (ingredient.name === query) {
                returnString = ingredient.displayName;
            }
        });
        return returnString;
    }

}

export { Ingredient, IngredientList, CustomIngredientMaker };