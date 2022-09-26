import { IngredientList } from "../cocktailData/ingredient.js";
import { Rating } from "../cocktailData/rating.js";

class user {

    constructor(username) {
        this.username = username;
        this.createdCocktails = [];
        this.favorites = [];
        this.blackListedIngredients = new IngredientList();
        this.givenRatings = [];
    }

    makeRating(cocktailID, stars, text) {
        let data = {}
        data.cocktailID = cocktailID;
        data.rating = new Rating(stars, text, this.username);
        //TODO: listener für cocktailListManager, der data weitergibt
        this.givenRatings.push(data);
    }

    addIngredientToBlackList(displayName) {
        // get all ingredients with the not wanted displayname
        let ingredients = this.blackListedIngredients.getAllIngredientsForDisplayName(displayName);
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