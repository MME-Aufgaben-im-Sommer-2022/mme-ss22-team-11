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

class IngredientList {

    constructor() {
        this.list = [];

        // Später für Zutatsauswahl (filter, usw)
        this.displayNames = [];
    }

    addIngredient(ingredient) {
        this.list.push(ingredient);
    }

    //TODO: aktualisieren auf die csv
    // Um Alle Ingredients mit selben displayName zu kriegen (wird vielleicht gebraucht)
    getAllIngredientsForDisplayName(query) {

        returnList = [];

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