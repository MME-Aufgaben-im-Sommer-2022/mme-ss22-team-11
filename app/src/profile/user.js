import { IngredientList } from "../cocktailData/ingredient.js";
import { Rating } from "../cocktailData/rating.js";
import { Observable, Event } from "../utils/Observable.js";

class User extends Observable {

    constructor(username) {

        super();

        this.username = username;
        this.createdCocktails = [];
        this.favorites = [];
        this.blackListedIngredients = new IngredientList();
        this.allIngredients = new IngredientList();

        this.allIngredients.addEventListener("INGREDIENTS_READY", (event) => this.fillAllIngredients(event.data))
        this.allIngredients.getAllIngredientsFromJSON();

        this.givenRatings = [];
    }

    fillAllIngredients(data) {
        data.forEach(el => this.allIngredients.addIngredient(el));
    }

    // wird aufgerufen, wenn eine Bewertung erstellt wird
    makeRating(cocktailID, stars, text) {
        let data = {}
        data.cocktailID = cocktailID;
        data.rating = new Rating(stars, text, this.username);

        //TODO: listener für cocktailListManager, der data weitergibt
        this.givenRatings.push(data);
    }

    // wird aufgerufen, wenn eine Zutat gesperrt werden soll
    addIngredientToBlackList(displayName) {

        // get all ingredients with the not wanted displayname
        let ingredients = this.allIngredients.getAllIngredientsForDisplayName(displayName);
        // add all those ingredients to the blackList
        ingredients.forEach(ingredient => {
            this.blackListedIngredients.addIngredient(ingredient);
        });
    }

    addCocktailToFavorites(cocktailID) {
        if (this.favorites.includes(cocktailID)) {
            return;
        }
        this.favorites.push(cocktailID);
    }

    // wenn der Nutzer einen Cocktail erstellt soll die ID hier gespeichert werden
    onCocktailCreated(cocktailID) {
        this.createdCocktails.push(cocktailID);
    }

}

export { User };