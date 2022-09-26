import AppwriteConnector from "./appwrite/AppwriteConnector.js";

function init() {
    console.log("### Starting MME Project ###"); // eslint-disable-line no-console
    let appwrite = new AppwriteConnector(),
    account = appwrite.createAccount("name", "max.mustermann@gmail.com", "12345678");
    console.log(account);
}

init();