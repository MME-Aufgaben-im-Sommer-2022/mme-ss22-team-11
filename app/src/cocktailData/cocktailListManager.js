import { Cocktail } from "./cocktail.js";
import { Component, Recipe } from "./recipe.js"
import { Ingredient, IngredientList, CustomIngredientMaker } from "./ingredient.js"
import { Observable, Event } from "../utils/Observable.js"
import AppwriteConnector from "../appwrite/AppwriteConnector.js";

class CocktailListManager extends Observable {

    constructor() {

        super();

        //this.appwrite = new AppwriteConnector();

        //TODO: aus Datenbank/API laden
        this.allCocktails = [];
        this.ingredientList = new IngredientList();

        this.getIngredientAndCocktailData();

        // setTimeout(() => this.getCocktailsFromJson(), 100);

        // Diese Liste soll immer angezeigt werden
        this.displayList = this.allCocktails;

        //TODO: listener hinzufügen um zu sehen wann daten bereit sind

    }

    getAllCommunityCocktails() {

        let returnList = [];

        // jeder Cocktail mit negativer ID ist von der Community
        this.allCocktails.forEach(cocktail => {
            if (cocktail.id < 0) {
                returnList.push(cocktail);
            }
        });

        return returnList;

    }

    //TODO: fertig machen
    cocktailsToJSON() {

        let obj = {};
        this.allCocktails.forEach(cocktail => {

            // getCocktailData
            let data = {};
            data.name = cocktail.name;
            data.author = cocktail.author;
            data.main_ingredients = cocktail.mainIngredients;
            data.deko_ingredients = cocktail.decoIngredients;
            data.steps = cocktail.steps;
            data.img = cocktail.image;
            data.description = cocktail.description;
            data.tags = cocktail.tags;
            data.ratings = cocktail.ratings;

            obj[cocktail.id] = data;

        });

        let json = JSON.stringify(obj);

        //console.log(json);

        //this.appwrite.createOrUpdateCommunityRecipes(json);

    }

    //TODO: aus Datenbank auslesen
    jsonToCommunityCocktails() {

        let json = this.appwrite.getDocumentFromDB(this.appwrite.RECIPE_DB_ID, this.appwrite.RECIPE_COM_COLLECTION_ID, this.appwrite.COMMUNITY_RECIPES_DOC_ID);

        // TODO: json zu liste und zu allcocktails hinzufügen (listener mit data ready)

    }

    // Soll Favoriten anzeigen
    getFavorites(idList) {

        let returnList = [];

        idList.forEach(id => {
            this.allCocktails.forEach(cocktail => {
                if (id == cocktail.id) {
                    returnList.push(cocktail);
                }
            });
        });

        return returnList;

    }

    //TODO: ausführen, wenn eine neue Bewertung abgegeben wird
    rateCocktail(data) {

        this.allCocktails.forEach(cocktail => {
            if (cocktail.id == data.cocktailID) {

                let allowed = true;

                // if there is already a rating for this cocktail by the same user;
                cocktail.ratings.forEach(rating => {
                    if (rating.username == data.rating.username) {
                        //TODO: überschreiben oder auslagern ob Bewertung möglich ist
                        console.log("ERNEUTE BEWERTUNG DES GLEICHEN COCKTAILS NICHT MÖGLICH");
                        allowed = false;
                    }
                });

                if (allowed) {
                    cocktail.addRating(data.rating);
                    // update cocktail in db
                }

            }
        })
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

    addCustomCocktail(name, recipe, image, tags, description, steps, author) {

        // TODO: letzte id aus db auslesen (daraus neue errechnen)
        let id = -1;
        let cocktail = new Cocktail(id, name, recipe, image, [], tags, description, steps, author);
        console.log(cocktail);
        this.allCocktails.push(cocktail);
        // TODO: db aktualisieren

    }

    addCocktailFromJSON(id, name, recipe, image, description, steps, author) {

        //TODO: letzte id aus Datenbank auslesen, dann: let id = UUID

        let newCocktail = new Cocktail(id, name, recipe, image, [], [], description, steps, author);
        this.allCocktails.push(newCocktail);
        //TODO: Datenbank updaten

    }

    // TODO: auslagern, soll nur ausgeführt werden wenn Datenbank leer ist
    getCocktailsFromJson() {
        fetch('./src/cocktailData/JSON/recipes.json')
            .then((response) => response.json())
            .then((json) => {

                for (let i in json) {

                    let data = json[i];
                    let recipe = this.getRecipeFromData(data);

                    this.addCocktailFromJSON(i, data.name, recipe, data.img, data.description, data.steps, data.author);
                }

                this.cocktailsToJSON();
                this.notifyAll(new Event("DATA_READY"));

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