import { Cocktail } from "./cocktail.js";
import { Component, Recipe } from "./recipe.js"
import { Ingredient, IngredientList } from "./ingredient.js"

class CocktailListManager {

    constructor() {
        //TODO: aus Datenbank/API laden
        this.allCocktails = [];
        this.ingredientList = new IngredientList();

        this.getIngredientData();

        setTimeout(() => this.getCocktailsFromJson(), 100);

        // Diese Liste soll immer angezeigt werden
        this.displayList = this.allCocktails;

        //TODO: listener hinzufügen um zu sehen wann daten bereit sind

    }

    getIngredientData() {
        fetch('./src/cocktailData/JSON/ingredients.json')
            .then((response) => response.json())
            .then((json) => {

                for (let i in json) {

                    let data = json[i];
                    let alcoholic = data.alcoholic == 1;
                    this.ingredientList.addIngredient(new Ingredient(i, data.display_name, alcoholic));

                }
            });
    }

    addCocktail(name, recipe, image, category, tags, description, steps, author) {

        // letzte id aus db auslesen (daraus neue errechnen)
        // neuen Cocktail machen
        // in cocktails pushen
        // db aktualisieren

    }

    addCocktailFromJSON(id, name, recipe, image, category, tags, description, steps, author) {

        //TODO: letzte id aus Datenbank auslesen, dann: let id = UUID

        let newCocktail = new Cocktail(id, name, recipe, image, undefined, 0, [], category, tags, description, steps, author);
        this.allCocktails.push(newCocktail);
        //TODO: Datenbank updaten

    }

    updateDisplayList(returnList) {
        this.displayList = returnList;
        //TODO: listener notifies ListView
    }

    searchCocktailByName(query) {

        let returnList = [];
        this.allCocktails.forEach(cocktail => {

            if (cocktail.name.startsWith(query)) {
                returnList.push(cocktail);
            }
        });
        this.updateDisplayList(returnList);;

    }

    filterCocktailsByBannedIngredient(bannedIngredients) {

        let bannedIds = this.checkIngredientBanList(bannedIngredients);
        let returnList = [];
        this.allCocktails.forEach(cocktail => {
            if (bannedIds.indexOf(cocktail.id) == -1) {
                returnList.push(cocktail);
            }
        })
        this.updateDisplayList(returnList);

    }

    getCocktailsFromIngredients(ingredients, withDeco) {

        returnList = [];
        this.allCocktails.forEach(cocktail => {
            if (cocktail.checkIfCocktailHasIngredients(ingredients, withDeco)) {
                returnList.push(cocktail)
            }
        })
        this.updateDisplayList(returnList);

    }

    checkIngredientBanList(bannedIngredients) {

        let bannedIds = []

        this.allCocktails.forEach(cocktail => {

            let ingredients = [];

            cocktail.recipe.mainIngredients.forEach(component => {
                ingredients.push(component.ingredient);
            })

            cocktail.recipe.decoIngredients.forEach(component => {
                ingredients.push(component.ingredient);
            })

            bannedIngredients.forEach(bannedIngredient => {
                if (ingredients.indexOf(bannedIngredient) != -1) {
                    bannedIds.push(cocktail.id);
                }
            });
        });

        return bannedIds;
    }

    getCocktailsFromJson() {
        fetch('./src/cocktailData/JSON/recipes.json')
            .then((response) => response.json())
            .then((json) => {

                for (let i in json) {

                    let data = json[i];
                    let recipe = this.getRecipeFromData(data);

                    this.addCocktailFromJSON(i, data.name, recipe, data.img, data.category, data.tags, data.description, data.steps, data.author);
                }
            });
    }

    getRecipeFromData(data) {
        let recipe = new Recipe();

        Object.entries(data.main_ingredients).forEach((entry) => {
            let [key, value] = entry;
            let ingredient = this.getIngredientFromKey(key);
            recipe.addMainIngredient(ingredient, value[0], value[1]);
        })

        Object.entries(data.deko_ingredients).forEach((entry) => {
            let [key, value] = entry;
            let ingredient = this.getIngredientFromKey(key);
            recipe.addMainIngredient(ingredient, value[0], value[1]);
        })

        return recipe;
    }

    getIngredientFromKey(key) {
        let alcoholic = this.ingredientList.isIngredientAlcoholic(key);
        let displayName = this.ingredientList.getDisplayNameFromName(key);
        return new Ingredient(key, displayName, alcoholic);
    }

}

export { CocktailListManager };