import { Cocktail } from "./cocktail.js";
import { Component, Recipe } from "./recipe.js"

class CocktailListManager {

    constructor() {
        //TODO: aus Datenbank/API laden
        this.allCocktails = [];
        this.getCocktailsFromJson(this);

        // Die Liste soll immer angezeigt werden
        this.displayList = this.allCocktails;

        setTimeout(() => console.log(this.searchCocktailByName("Moscow")), 100)
        setTimeout(() => console.log(this.filterCocktailsByBannedIngredient(["Cola", "Limette"])), 100)

    }

    addCocktail(name, recipe, image, category, tags, description, steps, author) {

        // id aus db auslesen
        // neuen Cocktail machen
        // in cocktails pushen
        // db aktualisieren

    }

    addCocktailFromJSON(id, name, recipe, image, category, tags, description, steps, author) {

        //TODO: letzte id aus Datenbank auslesen, dann: let id = letzte id + 1 (wenn id nicht angegeben)

        let newCocktail = new Cocktail(id, name, recipe, image, undefined, [], category, tags, description, steps, author);
        this.allCocktails.push(newCocktail);
        //TODO: Datenbank updaten

    }

    searchCocktailByName(query) {

        let returnList = [];
        this.allCocktails.forEach(cocktail => {

            if (cocktail.name.startsWith(query)) {
                returnList.push(cocktail);
            }
        });
        this.displayList = returnList;;

    }

    filterCocktailsByBannedIngredient(bannedIngredients) {

        let bannedIds = this.checkIngredientBanList(bannedIngredients);
        let returnList = [];
        this.allCocktails.forEach(cocktail => {
            if (bannedIds.indexOf(cocktail.id) == -1) {
                returnList.push(cocktail);
            }
        })
        this.displayList = returnList;;

    }

    getCocktailsFromIngredients(ingredients, withDeco) {

        returnList = [];
        this.allCocktails.forEach(cocktail => {
            if (cocktail.checkIfCocktailHasIngredients(ingredients, withDeco)) {
                returnList.push(cocktail)
            }
        })
        this.displayList = returnList;;

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
            let [key, value] = entry
            recipe.addMainIngredient(key, value[0], value[1])
        })

        Object.entries(data.deko_ingredients).forEach((entry) => {
            let [key, value] = entry
            recipe.addDecoIngredient(key, value[0], value[1])
        })

        return recipe;
    }

}

export { CocktailListManager };