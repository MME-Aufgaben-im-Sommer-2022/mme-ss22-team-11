import { Client, Account, Databases } from "appwrite";

const client = new Client,
    database = new Databases(client),
    account = new Account(client),
    USER_DB_ID = "632dbc2bc51bf9eaeb25",
    USER_COLLECTION_ID = "632dbc3088eeb52ba0d0",
    USER_FAVORITES_ID = "632dbd25ac63865b5a40",
    USER_BANNED_ITEMS_ID = "632dbd3adbbef22d24d8",
    RECIPE_DB_ID = "632dbc5238a0eeba297b",
    RECIPE_API_COLLECTION_ID = "632dbc5649f159c63894",
    RECIPE_COM_COLLECTION_ID = "632dbc5f18e03c05d7fe",
    INGREDIENTS_COLLECTION_ID = "632dbca9e003743dad75";

var email, password, name;

function initWebSDK() {
    client 
        .setEndpoint("https://appwrite.software-engineering.education/v1") //https://verwertbar.software-engineering.education/
        .setProject("62ecf9068d60a3eb72ab");
}

// account: register & login
function setEmail(email) {
    this.email = email;
}

function setPassword(password) {
    this.password = password;
}

function setName(name) {
    this.name = name;
}

// TODO: nicht sicher ob in der account.create methode bereits ein "bereits existieren check" eingebaut ist
// sonst -> methode mit return
function createAccount(email, password, name) {
    indexOfAt = email.indexOf('@');
    emailSpliced = email.substring(0, indexOfAt); 
    userId = emailSpliced + name.replace(/ /g, '_'); // Bsp.: max.mustermannMax_Mustermann

    account.create("unique()", email, password, name).then(response => {
        console.log(response); 
        createDocumentForDB(USER_DB_ID, USER_COLLECTION_ID, userId, response) 
        // creates a new document for each user with a custom_id combining email-name and user-name
    }, error => {
        console.log(error);
    });
}

function accountExistenceCheck(userId) {

}


function login(email, password) {
    const promise = account.createEmailSession(email, password);
    promise.then(response => {
        console.log(response); 
    }, error => {
        console.log(error);
        // display error message in ui?
    });
}

// database 
function createDocumentForDB(databaseId, collectionId, documentId, data) { // data as json object
    const promise = database.createDocument(databaseId, collectionId, documentId, data);
    promise.then(response => {
        console.log(response); 
    }, error => {
        console.log(error);
    });
}

function getDocumentFromDB(documentId) {
    const promise = database.getDocument(documentId);
    promise.then(response => {
        console.log(response); 
    }, error => {
        console.log(error);
    });
    return promise;
}

function updateDocumentFromDB(databaseId, collectionId, documentId, data) {
    const promise = database.updateDocument(databaseId, collectionId, documentId, data);
    promise.then(response => {
        console.log(response); 
    }, error => {
        console.log(error);
    });
}

function deleteDocumentFromDB(databaseId, collectionId, documentId) {
    const promise = database.deleteDocument(databaseId, collectionId, documentId);
    promise.then(response => {
        console.log(response); 
    }, error => {
        console.log(error);
    });
}

export function createAccount();
export function initWebSDK();