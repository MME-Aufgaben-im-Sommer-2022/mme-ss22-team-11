class Ingredient {

    constructor(id, name, displayName, alcoholic) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.alcoholic = alcoholic;
        this.replacements = [];
    }

    setReplacements(replacements) {
        this.replacements = replacements;
    }

}

class IngredientList {

    constructor() {
        this.list = [];

        // Später für Zutatsauswahl (filter, usw)
        this.displayNames = [];
    }

    getIngredients() {

    }

    // Um Alle Ingredients mit selben displayName zu kriegen (wird vielleicht gebraucht)
    getAllIngredientsForDisplayName(query) {

        returnList = [];

        this.list.forEach(ingredient => {
            if (ingredient.displayName === query) {
                returnList.push(ingredient);
            }
        })
    }

}

export { Ingredient };