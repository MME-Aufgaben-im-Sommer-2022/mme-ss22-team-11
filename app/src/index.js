import AppwriteConnector from "./appwrite/AppwriteConnector.js";

function init() {
    console.log("### Starting MME Project ###"); // eslint-disable-line no-console
    let appwrite = new AppwriteConnector();
    appwrite.createAccount("name", "max.mustermann@gmail.com", "12345678");
    //createAccount("leon.zagorac@hotmail.com", "passwort1234", "waiwha");
}

init();