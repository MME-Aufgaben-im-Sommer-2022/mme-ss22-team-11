import AppwriteConnector from "../appwrite/AppwriteConnector.js";
import { User } from "./user.js";

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

    // TODO: delete Account

}