import { Cocktail } from "./cocktail.js";
import { Component, Recipe } from "./recipe.js";
import { Ingredient, IngredientList, CustomIngredientMaker } from "./ingredient.js";
import { Observable, Event } from "../utils/Observable.js";
import AppwriteConnector from "../appwrite/AppwriteConnector.js";

let result;
const BATCH_SIZE = 25;

class CocktailListManager extends Observable {

    constructor() {
        super();

        result, this.appwrite = new AppwriteConnector();

        // wenn die CocktailID hier ist, muss mindestens eine Zutat ersetzt werden um der Suche zu entsprechen;
        this.markedIDs = [];

        //TODO: aus Datenbank/API laden
        this.allCocktails = [];
        this.ingredientList = new IngredientList();
        this.ingredientList.addEventListener("INGREDIENTS_READY", (event) => this.fillAllIngredients(event.data));
        this.ingredientList.getAllIngredientsFromJSON();
        this.substitutes = {};
        this.fillReplacements();

        // Diese Liste soll immer angezeigt werden
        this.displayList = this.allCocktails;

        // TODO: listener hinzufügen um zu sehen wann daten bereit sind
    }

    fillReplacements() {
        fetch('./src/cocktailData/JSON/substitute.json')
            .then((response) => response.json())
            .then((json) => {
                for (let i in json) {
                    let data = json[i];
                    this.substitutes[i] = data;
                }
            });
    }

    onReadyForCocktails() {
        this.getCocktailsFromDB();
    }

    fillAllIngredients(data) {
        this.allIngredients = new IngredientList();
        data.forEach(el => this.allIngredients.addIngredient(el));
        this.notifyAll(new Event("READY_FOR_COCKTAILS"));
    }

    async emptyDB() {
        let docs = await this.appwrite.countDocuments();
        console.log(docs);
        while (docs.total > 0) {
            docs.documents.forEach(data => {
                console.log(data.$id);
                this.appwrite.deleteDocument(data.$id);
            });
            docs = await this.appwrite.countDocuments();
        }
    }

    // read all docs to get cocktails
    async getCocktailsFromDB() {
        // this.emptyDB();
        // return;
        let count = await this.appwrite.countDocuments();


        // if there are no Cocktails in the DB, the cocktails from the json will be loaded
        if (count.total == 0) {
            this.getIngredientAndCocktailData();
            return;
        }

        this.getIngredientData();

        let docs = [];

        console.log(count.total);

        for (let i = BATCH_SIZE; i <= count.total + BATCH_SIZE; i += BATCH_SIZE) {
            let batch = await this.appwrite.listDocuments(i);
            let batchDocs = batch.documents;
            batchDocs.forEach(d => {
                docs.push(d);
            });
        }

        docs.forEach(data => {
            let id = data.$id.substring(10),
                recipe = JSON.parse(data.recipe),
                ratings = JSON.parse(data.ratings),
                steps = {},
                stepNr = 1;
            data.steps.forEach(stepDesc => {
                steps[stepNr] = stepDesc;
                stepNr += 1;
            });

            let img = data.image;

            // TODO: Storage beim befüllen statt hier auslesen und datei aus Storage holen
            // TODO: beim erstellen von einem Cocktail soll "STORAGE" als img vom cocktail gespeichert werden
            //if (data.image == "STORAGE") {
            //    img = this.getImgForID(id, data.image);
            //} else {
            //    img = data.image;
            //}
            let cocktail = new Cocktail(id, data.name, recipe, img, ratings, data.tags, data.description, steps, data.author);

            this.allCocktails.push(cocktail);
        });
        console.log(this.allCocktails);
        this.allCocktails.sort((a, b) => a.id - b.id);
        this.updateDisplayList(this.allCocktails);
    }

    async getImgForID(id) {
        return await this.appwrite.getFile(id);
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
        let json = this.appwrite.getDocumentFromDB(
            this.appwrite.RECIPE_DB_ID,
            this.appwrite.RECIPE_COM_COLLECTION_ID,
            this.appwrite.COMMUNITY_RECIPES_DOC_ID);

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
                    this.updateCocktail(cocktail);
                }
            }
        });
    }
    // database update
    async updateCocktail(cocktail) {
        let id = "cocktailNr" + cocktail.id;
        await this.appwrite.updateDocument(id, cocktail.toDBObject());
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

    // soll beim Event "COCKTAIL_CREATION_REQUESTED" ausgeführt werden
    addCustomCocktail(data) {

        console.log(data);

        let name = data.name,
            recipe = data.recipe,
            image = data.image,
            tags = data.tags,
            description = data.description,
            steps = data.steps,
            author = data.username,
            id = this.getNewID();

        if (image != "NO_IMAGE") {
            this.appwrite.createFile(id, image);
            image = "STORAGE";
        }

        // TODO: letzte id aus db auslesen (daraus neue errechnen)
        let cocktail = new Cocktail(id, name, recipe, image, [], tags, description, steps, author);
        console.log(cocktail);
        this.allCocktails.push(cocktail);
        this.notifyAll(new Event("COCKTAIL_CREATION_DONE"), cocktail.id);
        // TODO: db aktualisieren
        let dbID = "cocktailNr" + cocktail.id,
            dbData = cocktail.toDBObject();
        this.addCocktailToDB(dbID, dbData);

    }

    getNewID() {

        let ids = [];
        this.allCocktails.forEach(cocktail => {
            ids.push(Number(cocktail.id));
        });

        console.log(ids);
        let max = Math.max.apply(null, ids);
        console.log(max);

        return max + 1;

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

    async createImage(data) {
        return await this.appwrite.createFile(i, data);
    }

    updateDisplayList(returnList) {
        this.displayList = returnList;
        this.notifyAll(new Event("DATA_UPDATED"));
    }

    async deleteCocktail(id) {
        await this.appwrite.deleteDocument(id);
        this.allCocktails = [];
        this.getCocktailsFromDB();
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
        let data = this.checkIngredientBanList(bannedIngredients);
        let returnList = [];
        this.displayList.forEach(cocktail => {
            if (data.bannedIds.indexOf(cocktail.id) == -1) {
                returnList.push(cocktail);
            }
        });
        data.subIds.forEach(id => this.markedIDs.push(id));
        console.log(this.markedIDs);
        this.updateDisplayList(returnList);

    }

    // Zum Reste verwerten: nur cocktails mit ausschließlich den gewünschten Zutaten werden angezeigt
    getCocktailsFromIngredients(ingredients, withDeco) {

        if (ingredients.length == 0) {
            this.updateDisplayList(this.allCocktails);
            return;
        }

        let returnList = [];
        this.markedIDs = [];
        this.allCocktails.forEach(cocktail => {
            let bool = cocktail.checkIfCocktailHasOnlyTheseIngredients(ingredients, withDeco, this.substitutes)
            if (bool) {
                returnList.push(cocktail);
            } else if (bool == undefined) {
                returnList.push(cocktail);
                this.markedIDs.push(cocktail.id);
            }
        });
        this.updateDisplayList(returnList);
    }

    // Alle Cocktails die mindestens alle angegebenen Zutaten benötigen
    getCocktailsWithIngredients(ingredients, withDeco) {
        this.markedIDs = [];
        let returnList = [];
        this.allCocktails.forEach(cocktail => {
            let bool = cocktail.checkIfCocktailHasIngredients(ingredients, withDeco, this.substitutes);
            if (bool) {
                returnList.push(cocktail);
            } else if (bool == undefined) {
                returnList.push(cocktail);
                this.markedIDs.push(cocktail.id);
            }
        });
        this.updateDisplayList(returnList);
    }

    checkIngredientBanList(bannedIngredients) {

        let bannedIds = [];
        let subIds = [];

        this.allCocktails.forEach(cocktail => {
            let ingredients = [];
            cocktail.recipe.mainIngredients.forEach(component => {
                ingredients.push(component.ingredient.displayName);
            });
            cocktail.recipe.decoIngredients.forEach(component => {
                ingredients.push(component.ingredient.displayName);
            });

            bannedIngredients.forEach(bannedIngredient => {

                if (ingredients.indexOf(bannedIngredient) != -1) {

                    let canBeSubstituted = false;

                    // wenn ein Ersatz für die gesperrte Zutat möglich ist, soll der Cocktail markiert angezeigt werden
                    this.substitutes[bannedIngredient].forEach(sub => {

                        // wenn die bannedIngredient durch eine nicht gebannte Zutat ersetzt werden kann
                        if (bannedIngredients.indexOf(sub) == -1) {
                            canBeSubstituted = true;
                            console.log(sub);
                        }

                    });

                    if (canBeSubstituted) {
                        subIds.push(cocktail.id);
                    } else {
                        bannedIds.push(cocktail.id);
                        subIds = subIds.filter(item => item != cocktail.id);
                    }

                }
            });
        });
        return { subIds, bannedIds };
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
        let alcoholic = this.allIngredients.isIngredientAlcoholic(key),
            displayName = this.allIngredients.getDisplayNameFromName(key);
        return new Ingredient(key, displayName, alcoholic);
    }

}

export { CocktailListManager };