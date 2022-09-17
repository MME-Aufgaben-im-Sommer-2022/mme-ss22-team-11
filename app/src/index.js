import { createAccount, initWebSDK } from "./appwrite/appwrite";

function init() {
    console.log("### Starting MME Project ###"); // eslint-disable-line no-console
    initWebSDK();
    createAccount("leon.zagorac@hotmail.com", "passwort1234", "waiwha");
}

init();