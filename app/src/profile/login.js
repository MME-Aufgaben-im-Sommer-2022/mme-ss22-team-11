import AppwriteConnector from "../appwrite/AppwriteConnector.js";
import Observable, { Event } from "../utils/Observable.js";
import { User } from "./user.js";

// soll in index.js benutzt werden um den user festzustellen

let result;

class Login extends Observable {

    constructor() {
        super();
        this.appwrite = new AppwriteConnector();
    }

    async singUp(username, email, password) {
        await this.appwrite.createAccount(username, email, password);
        await this.appwrite.createSession(email, password);
        let user = new User(email, username),
            toSave = user.toSavedObj();
        await this.appwrite.setPreferences(toSave);
        this.notifyAll(new Event("LOGIN", user));

    }

    async login(email, password) {
        this.appwrite.createSession(email, password);
        let json = await this.appwrite.getPreferences(),
            user = new User(email, json.username);

        user.createdCocktails = json.createdCocktails;
        user.favorites = json.favorites;
        user.blackListedIngredients = json.blackListedIngredients;
        user.givenRatings = json.givenRatings;

        this.notifyAll(new Event("LOGIN", user));

    }

    // wenn sich was am user ändert, wird diese Methode aufgerufen
    async updateUser(data) {
        await this.appwrite.setPreferences(data);
    }

    // für anonyme Nutzer
    // TODO: undefined id abfangen, um verschiedene Funktionen zu sperren
    getDefaultUser() {
        return new User(undefined, undefined, undefined);
    }

    // TODO: delete Account

}

export { Login };