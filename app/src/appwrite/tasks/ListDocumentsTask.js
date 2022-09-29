import Config from "../AppwriteConfig.js";
import AppwriteTask from "./AppwriteTask.js";

export default class ListDocumentsTask extends AppwriteTask {

    async createResult() {
      let database = new this.appwrite.Databases(this.client, Config.database);
      try {
        return await database.getDocument(Config.database.collections.recipe);
      } catch (error) {
        console.error(error);
        throw new Error("Error while trying to list thea documents.");
      }
    }
  
  }