import AppwriteConnector from "../appwrite/AppwriteConnector.js";
import Observable, { Event } from "../utils/Observable.js";
import { User } from "./user.js";

// soll in index.js benutzt werden um den user festzustellen

class Login extends Observable {

    constructor() {
        super();
        this.appwrite = new AppwriteConnector();
    }

    singUp(username, email, password) {
        this.appwrite.createAccount(username, email, password);
        // this.appwrite.login(email, password);
        let id = email.replace("@", "_"),
            user = new User(email, username, id),
            json = user.toJSON();
        console.log("JSON: ", json);
        this.appwrite.setPreferences(json);
        this.notifyAll(new Event("SIGN_UP", user));

    }

    login(email, password) {
        this.appwrite.login(email, password);
        let id = email.replace("@", "_");
        let json = this.appwrite.getUserPreferences();
        let user = new User(json.email, json.username, id);
        user.createdCocktails = json.createdCocktails;
        user.favorites = json.favorites;
        user.blackListedIngredients = json.blackListedIngredients;
        user.allIngredients = json.allIngredients;
        user.givenRatings = json.givenRatings;

        console.log(json)

        this.notifyAll(new Event("LOGIN", user));
    }

    // für anonyme Nutzer
    // TODO: undefined id abfangen, um verschiedene Funktionen zu sperren
    getDefaultUser() {
        return new User(undefined, undefined, undefined);
    }

    // TODO: delete Account

}

export { Login };