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
        // TODO: appwrite add user to db

    }

    login(id) {
        // TODO: get user by id with appwrite -> return user;
    }

    // für anonyme Nutzer
    // TODO: undefined id abfangen, um verschiedene Funktionen zu sperren
    getDefaultUser() {
        return new User(undefined, undefined, undefined);
    }

    // TODO: delete Account

}