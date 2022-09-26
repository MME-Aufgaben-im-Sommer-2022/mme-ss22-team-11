import { Cocktail } from "./cocktail.js";
import { Component, Recipe } from "./recipe.js"
import { Ingredient, IngredientList, CustomIngredientMaker } from "./ingredient.js"
import { Observable, Event } from "../utils/Observable.js"

class CocktailListManager extends Observable {

    constructor() {

        super();

        //TODO: aus Datenbank/API laden
        this.allCocktails = [];
        this.ingredientList = new IngredientList();

        this.getIngredientAndCocktailData();

        // setTimeout(() => this.getCocktailsFromJson(), 100);

        // Diese Liste soll immer angezeigt werden
        this.displayList = this.allCocktails;

        //TODO: listener hinzufügen um zu sehen wann daten bereit sind

    }

    getIngredientAndCocktailData() {
        fetch('./src/cocktailData/JSON/ingredients.json')
            .then((response) => response.json())
            .then((json) => {

                for (let i in json) {

                    let data = json[i];
                    let alcoholic = data.alcoholic == 1;
                    this.ingredientList.addIngredient(new Ingredient(i, data.display_name, alcoholic));

                }

                this.getCocktailsFromJson();

            });
    }

    addCocktail(name, recipe, image, category, tags, description, steps, author) {

        // letzte id aus db auslesen (daraus neue errechnen)
        // neuen Cocktail machen
        // in cocktails pushen
        // db aktualisieren

    }

    addCocktailFromJSON(id, name, recipe, image, category, description, steps, author) {

        //TODO: letzte id aus Datenbank auslesen, dann: let id = UUID

        let newCocktail = new Cocktail(id, name, recipe, image, [], category, [], description, steps, author);
        this.allCocktails.push(newCocktail);
        //TODO: Datenbank updaten

    }

    getCocktailsFromJson() {
        fetch('./src/cocktailData/JSON/recipes.json')
            .then((response) => response.json())
            .then((json) => {

                for (let i in json) {

                    let data = json[i];
                    let recipe = this.getRecipeFromData(data);

                    this.addCocktailFromJSON(i, data.name, recipe, data.img, data.category, data.description, data.steps, data.author);
                }

                //TODO: get Data from db (notify after that)

                //TODO: notify data ready
                this.notifyAll(new Event("DATA_READY"))

            });
    }

    updateDisplayList(returnList) {
        this.displayList = returnList;
        this.notifyAll(new Event("DATA_UPDATED"));
    }

    searchCocktailByName(query) {
        let returnList = [];
        this.allCocktails.forEach(cocktail => {
            // make cocktail name & query lowercase for comparing
            let name = cocktail.name.toLowerCase()
            query = query.toLowerCase();
            if (name.startsWith(query)) {
                returnList.push(cocktail);
            }
        });
        this.updateDisplayList(returnList);

    }

    filterCocktailsByBannedIngredient(bannedIngredients) {

        let bannedIds = this.checkIngredientBanList(bannedIngredients);
        let returnList = [];
        this.displayList.forEach(cocktail => {
            if (bannedIds.indexOf(cocktail.id) == -1) {
                returnList.push(cocktail);
            }
        })
        this.updateDisplayList(returnList);

    }

    // Zum Reste verwerten: nur cocktails mit ausschließlich den gewünschten Zutaten werden angezeigt
    getCocktailsFromIngredients(ingredients, withDeco) {

        let returnList = [];
        this.allCocktails.forEach(cocktail => {
            if (cocktail.checkIfCocktailHasOnlyTheseIngredients(ingredients, withDeco)) {
                returnList.push(cocktail)
            }
        })
        this.updateDisplayList(returnList);

    }

    // Alle Cocktails die mindestens alle angegebenen Zutaten benötigen
    getCocktailsWithIngredients(ingredients, withDeco) {

        let returnList = [];
        this.allCocktails.forEach(cocktail => {
            if (cocktail.checkIfCocktailHasIngredients(ingredients, withDeco)) {
                returnList.push(cocktail);
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