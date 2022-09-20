import { Client, Account, Databases } from "appwrite";

const client = new Client,
    database = new Databases(client),
    account = new Account(client),
    USER_DB_ID = "6322d6999d9ad2fabc63",
    USER_COLLECTION_ID = "6326133862b6c6746fc1",
    USER_FAVORITES_ID = "632749b758251bc08b30",
    USER_BANNED_ITEMS_ID = "632749c57031dcb0980d",
    RECIPE_DB_ID = "6322d6ffdea08bc3930f",
    RECIPE_API_COLLECTION_ID = "6323493524902ec055c8",
    RECIPE_COM_COLLECTION_ID = "6323493e3da89e47d6df",
    INGREDIENTS_DB_ID = "6322d70dc0f5c92d07d7",
    INGREDIENTS_ALC_COLLECTION_ID = "632614a6f0647279b0c4",
    INGREDIENTS_NON_COLLECTION_ID = "632614fec586672f06e2";

var email, password, name;

function initWebSDK() {
    client 
        .setEndpoint("http://localhost/v1") //https://verwertbar.software-engineering.education/
        .setProject("6322d676c4aa83f07836");
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