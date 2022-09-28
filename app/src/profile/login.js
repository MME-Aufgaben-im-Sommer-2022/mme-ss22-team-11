import AppwriteConnector from "../appwrite/AppwriteConnector.js";
import { User } from "./user.js";

// soll in index.js benutzt werden um den user festzustellen

class Login {

    constructor() {
        this.appwrite = new AppwriteConnector();
    }

    singUp(username, email, password) {
        this.appwrite.createAccount(username, email, password);
        let id = email.replace("@", "_");
        let user = new User(email, username, id);
        
        let json = JSON.stringify(user);
        this.appwrite.safeUserInDB(id, json);

    }

    login(id) {
        let json = this.appwrite.getUserFromDB(id);

        let user = new User(json.email, json.username, id);
        user.createdCocktails = json.createdCocktails;
        user.favorites = json.favorites;
        user.blackListedIngredients = json.blackListedIngredients;
        user.allIngredients = json.allIngredients;
        user.givenRatings = json.givenRatings;

        return user;
    }

    // für anonyme Nutzer
    // TODO: undefined id abfangen, um verschiedene Funktionen zu sperren
    getDefaultUser() {
        return new User(undefined, undefined, undefined);
    }

    // TODO: delete Account

}