/* 
    global Appwrite
*/
const
  API_KEY = "5baa5fb4c8b2ae1502f7773b11fe748dbc7e95cd8d4dbd967cb4b757d243db439183f8b8a774d2376a40d447f89f001542ced75e9e5e02871b96f4a7b4862d2e76f65c82e7b77cfb0c29fd570e12ba2afaa05419152a75cd836122f0908631496cc01a796aaf2eb102c2eb645b52ef87f77437381f822eda95ee73f087d15e3c",
  DB_ID = "633441b010a3d7ab7519",
  // USER_COLLECTION_ID = "633441b6674e76102ea8",
  RECIPE_COM_COLLECTION_ID = "633442068d24b2efce9b",
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
    this.database = new Appwrite.Databases(this.client);
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

    // TODO: Listener -> erstell neuen user
  }

  async login(email, password) {
    console.log("IN: APPWRITE LOGIN");
    try {
      let session = await this.account.createEmailSession(email, password);
      return session;
    } catch (error) {
      console.error(error);
      throw new Error("Error while trying to create a session");
    }
  }

  async createDocumentForDB(databaseId, collectionId, documentId, data) { // data as json object
    console.log("DATA: ", data);
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

    if (this.getDocumentFromDB(DB_ID, RECIPE_COM_COLLECTION_ID, COMMUNITY_RECIPES_DOC_ID) == undefined) {
      this.createDocumentForDB(DB_ID, RECIPE_COM_COLLECTION_ID, COMMUNITY_RECIPES_DOC_ID, data);
    } else {
      this.updateDocumentFromDB(DB_ID, RECIPE_COM_COLLECTION_ID, COMMUNITY_RECIPES_DOC_ID, data);
    }
  }

  // banned ingredients + favorites (json format)
  async getUserPreferences() {
    let promise;
    try {
      return await this.account.getPrefs();
    } catch (error) {
      console.error(error);
    }
    return promise;
  }

  async updateUserPreferences(prefs) {
    try {
      const promise = await this.account.updatePrefs(prefs); // ({}) json 
      console.log(promise);
    } catch (error) {
      console.error(error);
    }
  }


  async setPreferences(preferences) {

  let account = new Appwrite.Account(this.client);
  try {
    return await account.updatePrefs({ user: preferences });
  } catch (error) {
    console.log(error);
    throw new Error("Error while trying to create new account");
  }
}
}

export default AppwriteConnector;