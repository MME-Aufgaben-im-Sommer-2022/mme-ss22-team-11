import { Cocktail } from "./cocktail.js";
import { Component, Recipe } from "./recipe.js";
import { Ingredient, IngredientList, CustomIngredientMaker } from "./ingredient.js";
import { Observable, Event } from "../utils/Observable.js";
import AppwriteConnector from "../appwrite/AppwriteConnector.js";

let result;

class CocktailListManager extends Observable {

    constructor() {

        super();

        result, this.appwrite = new AppwriteConnector();

        //TODO: aus Datenbank/API laden
        this.allCocktails = [];
        this.ingredientList = new IngredientList();
        this.ingredientList.addEventListener("INGREDIENTS_READY", (event) => this.fillAllIngredients(event.data));
        this.ingredientList.getAllIngredientsFromJSON();

        // setTimeout(() => this.getCocktailsFromJson(), 100);

        // Diese Liste soll immer angezeigt werden
        this.displayList = this.allCocktails;

        // TODO: listener hinzufügen um zu sehen wann daten bereit sind

    }

    onReadyForCocktails() {
        this.getCocktailsFromDB();
    }

    fillAllIngredients(data) {
        this.allIngredients = new IngredientList();
        data.forEach(el => this.allIngredients.addIngredient(el));
        console.log("JETZT");
        this.notifyAll(new Event("READY_FOR_COCKTAILS"));
    }

    async emptyDB() {

        let docs = await this.appwrite.listDocuments();
        console.log(docs);

        while (docs.total > 0) {

            docs.documents.forEach(data => {
                console.log(data.$id);
                this.appwrite.deleteDocument(data.$id);
            });

            docs = await this.appwrite.listDocuments();

        }
    }

    // read all docs to get cocktails
    async getCocktailsFromDB() {

        console.log(this.ingredientList);

        let cocktailDataFromDB = await this.appwrite.listDocuments();

        console.log(cocktailDataFromDB);
        

        // if there are no Cocktails in the DB, the cocktails from the json will be loaded
        if (cocktailDataFromDB.total == 0) {
            this.getIngredientAndCocktailData();
        }

        this.getIngredientData();

        let docs = [];

        // die ids von 0 bis 99 sind offiziell
        for (let i = 0; i < cocktailDataFromDB.total; i++) {
            let id = "cocktailNr" + i.toString(),
                doc = await this.appwrite.getDocument(id);
            docs.push(doc);
        }

        console.log("docs: ", docs);


        docs.forEach(data => {

            let id = data.$id.substring(10);

            let recipe = JSON.parse(data.recipe),
                ratings = JSON.parse(data.ratings),
                steps = {},
                stepNr = 1;
            data.steps.forEach(stepDesc => {
                steps[stepNr] = stepDesc;
                stepNr += 1;
            });

            // TODO: image
            let cocktail = new Cocktail(id, data.name, recipe, data.image, ratings, data.tags, data.description, steps, data.author);

            this.allCocktails.push(cocktail);

        });

        this.allCocktails.sort((a, b) => a.id - b.id);
        this.updateDisplayList(this.allCocktails);
 

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
    async cocktailsToJSON() {

        this.allCocktails.forEach(cocktail => {
            let id = "cocktailNr" + cocktail.id,
                data = cocktail.toDBObject();
            this.addCocktailToDB(id, data);

        });

    }

    async addCocktailToDB(id, data) {

        if (await this.appwrite.getDocument(id) != undefined) {
            return;
        }

        await this.appwrite.createDocument(id, data);
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
        });
    }

    getIngredientAndCocktailData() {
        this.getIngredientData();
        this.getCocktailsFromJson();
    }

    getIngredientData() {
        fetch('./src/cocktailData/JSON/ingredients.json')
            .then((response) => response.json())
            .then((json) => {

                for (let i in json) {

                    let data = json[i],
                        alcoholic = data.alcoholic == 1;
                    this.ingredientList.addIngredient(new Ingredient(i, data.display_name, alcoholic));

                }

            });
    }

    addCustomCocktail(name, recipe, image, tags, description, steps, author) {

        // TODO: letzte id aus db auslesen (daraus neue errechnen)
        let id = -1,
            cocktail = new Cocktail(id, name, recipe, image, [], tags, description, steps, author);
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

                    let data = json[i],
                        recipe = this.getRecipeFromData(data);

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
            let name = cocktail.name.toLowerCase();
            query = query.toLowerCase();
            if (name.startsWith(query)) {
                returnList.push(cocktail);
            }
        });
        this.updateDisplayList(returnList);

    }

    filterCocktailsByBannedIngredient(bannedIngredients) {

        let bannedIds = this.checkIngredientBanList(bannedIngredients),
            returnList = [];
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
                returnList.push(cocktail);
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

        let bannedIds = [];

        this.allCocktails.forEach(cocktail => {

            let ingredients = [];

            cocktail.recipe.mainIngredients.forEach(component => {
                ingredients.push(component.ingredient);
            });

            cocktail.recipe.decoIngredients.forEach(component => {
                ingredients.push(component.ingredient);
            });

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
            let [key, value] = entry,
                ingredient = this.getIngredientFromKey(key);
            recipe.addMainIngredient(ingredient, value[0], value[1]);
        });

        Object.entries(data.deko_ingredients).forEach((entry) => {
            let [key, value] = entry,
                ingredient = this.getIngredientFromKey(key);
            recipe.addMainIngredient(ingredient, value[0], value[1]);
        });

        return recipe;
    }

    getIngredientFromKey(key) {
        let alcoholic = this.ingredientList.isIngredientAlcoholic(key),
            displayName = this.ingredientList.getDisplayNameFromName(key);
        return new Ingredient(key, displayName, alcoholic);
    }

}

export { CocktailListManager };