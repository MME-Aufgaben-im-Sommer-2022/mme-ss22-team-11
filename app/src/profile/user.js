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
    this.blackListedIngredients = [];
    this.allIngredients = new IngredientList();
    this.givenRatings = [];

    this.allIngredients.addEventListener("INGREDIENTS_READY", (event) => this
      .fillAllIngredients(event.data));
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

    if (this.givenRatings.indexOf(cocktailID) !== -1) {
      this.notifyAll("NO_RATING_POSSIBLE");
      alert("Du musst erst die aktuelle Bewertung für diesen Cocktail im Profil-Tab löschen!");
      return;
    }

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

    let newRatings = [],
      data = {};
    this.givenRatings.forEach(rating => {
      if (rating.cocktailID !== cocktailID) {
        newRatings.push(rating);
      }
    });
    this.givenRatings = newRatings;
    // User changed => update in db
    this.notifyAll(new Event("USER_DATA_CHANGED", this.toSavedObj()));

    data.cocktailID = cocktailID;
    data.username = this.username;
    this.notifyAll(new Event("DELETE_RATING", data));
  }

  // BLACKLIST
  // wird aufgerufen, wenn eine Zutat gesperrt werden soll
  addIngredientToBlackList(displayName) {

    this.blackListedIngredients.push(displayName);

    // console.log(this.blackListedIngredients);

    // User changed => update in db
    this.notifyAll(new Event("USER_DATA_CHANGED", this.toSavedObj()));
  }

  deleteIngredientFromBlackList(displayName) {

    let lst = [];
    this.blackListedIngredients.forEach(ingredient => {
      if (ingredient !== displayName) {
        lst.push(ingredient);
      }
    });

    this.blackListedIngredients = lst;

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
    // TODO: code wieder ausführen lassen
    // this.createdCocktails.push(cocktailID);
    // User changed => update in db
    // this.notifyAll(new Event("USER_DATA_CHANGED", this.toSavedObj()));
  }

  // soll aufgerufen werden, wenn ein Cocktail erstellt werden soll
  createCocktail(data) {
    data.username = this.username;
    this.notifyAll(new Event("COCKTAIL_CREATION_REQUESTED", data));
  }

  // wenn ein cocktail von diesem User gelöscht wurde
  onCocktailDeleted(cocktailID) {
    if (!this.createdCocktails.includes(cocktailID)) {
      return;
    }
    this.createdCocktails.splice(this.createdCocktails.indexOf(cocktailID),
    1);
    // User changed => update in db
    this.notifyAll(new Event("USER_DATA_CHANGED", this.toSavedObj()));
  }

}

export { User };