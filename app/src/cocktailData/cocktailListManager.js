import { Cocktail } from "./cocktail.js";
import { Component, Recipe } from "./recipe.js"

class CocktailListManager {

    constructor(cocktails) {
        //TODO: aus Datenbank/API laden
        this.cocktails = cocktails;
    }

    addCocktail(name, recipe, image, category, tags, description, author) {

        //TODO: letzte id aus Datenbank auslesen, dann: let id = letzte id + 1
        let id = 0;

        newCocktail = new Cocktail(id, name, recipe, image, undefined, [], category, tags, description, author);
        this.cocktails.push(newCocktail);
        //TODO: Datenbank updaten

    }

    searchCocktailByName(query) {

        let returnList = [];
        this.cocktails.array.forEach(cocktail => {
            if (cocktail.name.startWith(query)) {
                returnList.push(cocktail);
            }
        });
        return returnList;

    }

    filterCocktailsByBannedIngredient(bannedIngredients) {

        let bannedIds = this.checkIngredientBanList(bannedIngredients);
        let returnList = [];
        this.cocktails.array.forEach(cocktail => {
            if(bannedIds.indexOf(cocktail.id) == -1) {
                returnList.push(cocktail);
            }
        })

        return returnList;

    }

    checkIngredientBanList(bannedIngredients) {

        let bannedIds = []

        this.cocktails.array.forEach(cocktail => {

            let ingredients = [];

            cocktail.recipe.forEach(component => {
                ingredients.push(component);
            })

            bannedIngredients.array.forEach(bannedIngredient => {
                if (ingredients.indexOf(bannedIngredient) != -1) {
                    bannedIds.push(cocktail.id);
                }
            });
        });

        return bannedIds;
    }

}