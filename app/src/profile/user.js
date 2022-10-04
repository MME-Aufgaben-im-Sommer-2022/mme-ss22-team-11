import { IngredientList } from "../cocktailData/ingredient.js";
import { Rating } from "../cocktailData/rating.js";
import { Observable, Event } from "../utils/Observable.js";

class User extends Observable {

    constructor(email, username) {

        super();

        this.email = email;
        this.username = username;
        this.createdCocktails = [];
        this.favorites = [];
        this.blackListedIngredients = new IngredientList();
        this.allIngredients = new IngredientList();
        this.givenRatings = [];

        this.allIngredients.addEventListener("INGREDIENTS_READY", (event) => this.fillAllIngredients(event.data))
        this.allIngredients.getAllIngredientsFromJSON();

    }

    toSavedObj() {
        let data = {};
        data.username = this.username;
        data.favorites = this.favorites;
        data.blackListedIngredients = this.blackListedIngredients;
        data.givenRatings = this.givenRatings;
        data.createdCocktails = this.createdCocktails;

        return data;
    }

    fillAllIngredients(data) {
        this.allIngredients = new IngredientList();
        data.forEach(el => this.allIngredients.addIngredient(el));
    }

    //RATINGS
    // wird aufgerufen, wenn eine Bewertung erstellt wird
    makeRating(cocktailID, stars, text) {
        let data = {};
        data.cocktailID = cocktailID;
        data.rating = new Rating(stars, text, this.username);

        //TODO: listener in cocktailManager oder ähnlichem nutzen
        this.notifyAll(new Event("RATING_READY", data));

        this.givenRatings.push(data);

        // User changed => update in db
        this.notifyAll(new Event("USER_DATA_CHANGED", this.toSavedObj()));
    }

    deleteRating(cocktailID) {

        let newRatings = [];
        this.givenRatings.forEach(rating => {
            if (rating.cocktailID != cocktailID) {
                newRatings.push(rating);
            }
        });
        this.givenRatings = newRatings;
        // User changed => update in db
        this.notifyAll(new Event("USER_DATA_CHANGED", this.toSavedObj()));
        let data = {}
        data.cocktailID = cocktailID;
        data.username = this.username;
        this.notifyAll(new Event("DELETE_RATING", data));
    }

    // BLACKLIST
    // wird aufgerufen, wenn eine Zutat gesperrt werden soll
    addIngredientToBlackList(displayName) {

        // get all ingredients with the not wanted displayname
        let ingredients = this.allIngredients.getAllIngredientsForDisplayName(displayName);
        // add all those ingredients to the blackList
        ingredients.forEach(ingredient => {
            this.blackListedIngredients.addIngredient(ingredient);
        });

        // User changed => update in db
        this.notifyAll(new Event("USER_DATA_CHANGED", this.toSavedObj()));
    }

    deleteIngredientFromBlackList(displayName) {

        // get all ingredients with the not wanted displayname
        let ingredients = this.allIngredients.getAllIngredientsForDisplayName(displayName);
        // add all those ingredients to the blackList
        ingredients.forEach(ingredient => {
            this.blackListedIngredients.removeIngredient(ingredient);
        });

        // User changed => update in db
        this.notifyAll(new Event("USER_DATA_CHANGED", this.toSavedObj()));
    }

    // FAVORITES
    // wird aufgerufen, wenn ein Cocktail zu den Favoriten hinzugefügt wird
    addCocktailToFavorites(cocktailID) {
        if (this.favorites.includes(cocktailID)) {
            return;
        }
        this.favorites.push(cocktailID);

        // User changed => update in db
        this.notifyAll(new Event("USER_DATA_CHANGED", this.toSavedObj()));
    }

    deleteCocktailFromFavorites(cocktailID) {
        if (!this.favorites.includes(cocktailID)) {
            return;
        }
        this.favorites.splice(this.favorites.indexOf(cocktailID), 1);
        // User changed => update in db
        this.notifyAll(new Event("USER_DATA_CHANGED", this.toSavedObj()));
    }

    // CREATED COCKTAILS
    // wenn der Nutzer einen Cocktail erstellt soll die ID hier gespeichert werden
    onCocktailCreated(cocktailID) {
        this.createdCocktails.push(cocktailID);
        // User changed => update in db
        this.notifyAll(new Event("USER_DATA_CHANGED", this.toSavedObj()));
    }

    // wenn ein cocktail von diesem User gelöscht wurde
    onCocktailDeleted(cocktailID) {
        if (!this.createdCocktails.includes(cocktailID)) {
            return;
        }
        this.createdCocktails.splice(this.createdCocktails.indexOf(cocktailID), 1);
        // User changed => update in db
        this.notifyAll(new Event("USER_DATA_CHANGED", this.toSavedObj()));
    }

}

export { User };