/* 
    global Appwrite
*/
const
  USER_DB_ID = "632dbc2bc51bf9eaeb25",
  USER_COLLECTION_ID = "632dbc3088eeb52ba0d0",
  RECIPE_DB_ID = "632dbc5238a0eeba297b",
  RECIPE_COM_COLLECTION_ID = "632dbc5f18e03c05d7fe",
  COMMUNITY_RECIPES_DOC_ID = "communityRecipes";

class AppwriteConnector {

  // using the constructer creates the Appwrite Client
  // only initiate 1 time!
  constructor() {
    this.client = new Appwrite.Client();
    this.client
      .setEndpoint(
        "https://appwrite.software-engineering.education/v1") // parameter an konstruktor übergeben
      .setProject("62ecf9068d60a3eb72ab");
    this.database = new Appwrite.Database(this.client);
    this.account = new Appwrite.Account(this.client);
  }

  // method used when creating a new account
  async createAccount(name, email, password) {
    let result,
      userId = email.replace('@', '_'); // Bsp.: max.mustermann_email.de

    try {
      result = await this.account.create(userId, email, password, name);
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }

    return result;
  }

  async login(email, password) {
    const promise = await this.account.createEmailSession(email, password);
    promise.then(response => {
      console.log(response);
      // this.createDocumentForDB(USER_DB_ID, USER_COLLECTION_ID, userId, account)
    }, error => {
      console.log(error);
      // display error message in ui?
    });
  }

  // 

  async createDocumentForDB(databaseId, collectionId, documentId, data) { // data as json object
    const promise = await this.database.createDocument(databaseId, collectionId, documentId, data);
    promise.then(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  async updateDocumentFromDB(databaseId, collectionId, documentId, data) {
    const promise = await this.database.updateDocument(databaseId, collectionId, documentId,
      data);
    promise.then(response => {
      console.log(response);
    }, error => {
      console.log(error);
    });
  }

  async getDocumentFromDB(databaseId, collectionId, documentId) { // not id, but email? wrap with "contains",
    // TODO: don't know if this works out with the current userId
    const promise = await this.database.getDocument(databaseId, collectionId, documentId);
    promise.then(response => {
      console.log(response);
    }, error => {
      console.log(error);
      return undefined;
    });
    return promise;
  }

  // RECIPE_DB_ID, RECIPE_COM_COLLECTION_ID, COMMUNITY_RECIPES_DOC_ID
  // TODO: test
  async createOrUpdateCommunityRecipes(data) {

    if (this.getDocumentFromDB(RECIPE_DB_ID, RECIPE_COM_COLLECTION_ID, COMMUNITY_RECIPES_DOC_ID) == undefined) {
      this.createDocumentForDB(RECIPE_DB_ID, RECIPE_COM_COLLECTION_ID, COMMUNITY_RECIPES_DOC_ID, data);
    } else {
      this.updateDocumentFromDB(RECIPE_DB_ID, RECIPE_COM_COLLECTION_ID, COMMUNITY_RECIPES_DOC_ID, data);
    }
  }

}
/*

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
  userId = emailSpliced + name.replace(/ /g,
  '_'); // Bsp.: max.mustermannMax_Mustermann

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
function createDocumentForDB(databaseId, collectionId, documentId,
data) { // data as json object
  const promise = database.createDocument(databaseId, collectionId, documentId,
    data);
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
  const promise = database.updateDocument(databaseId, collectionId, documentId,
    data);
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
*/

export default AppwriteConnector;