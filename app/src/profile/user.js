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

    // wird aufgerufen, wenn eine Bewertung erstellt wird
    makeRating(cocktailID, stars, text) {
        let data = {}
        data.cocktailID = cocktailID;
        data.rating = new Rating(stars, text, this.username);

        //TODO: listener in cocktailManager oder ähnlichem nutzen
        this.notifyAll(new Event("RATING_READY", data))

        this.givenRatings.push(data);
        // TODO: update user in db
    }

    // wird aufgerufen, wenn eine Zutat gesperrt werden soll
    addIngredientToBlackList(displayName) {

        // get all ingredients with the not wanted displayname
        let ingredients = this.allIngredients.getAllIngredientsForDisplayName(displayName);
        // add all those ingredients to the blackList
        ingredients.forEach(ingredient => {
            this.blackListedIngredients.addIngredient(ingredient);
        });

        // TODO: update user in db
    }

    addCocktailToFavorites(cocktailID) {
        if (this.favorites.includes(cocktailID)) {
            return;
        }
        this.favorites.push(cocktailID);

        // TODO: update user in db
    }

    // wenn der Nutzer einen Cocktail erstellt soll die ID hier gespeichert werden
    onCocktailCreated(cocktailID) {
        this.createdCocktails.push(cocktailID);
        // TODO: update user in db
    }

}

export { User };