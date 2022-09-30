import Config from "../AppwriteConfig.js";
import AppwriteTask from "./AppwriteTask.js";

export default class ListDocumentsTask extends AppwriteTask {

    async createResult() {
      let database = new this.appwrite.Databases(this.client, Config.database.id);
      try {
        return await database.listDocuments(Config.database.collections.recipe.id);
      } catch (error) {
        console.log(error);
        return undefined;
      }
    }
  
  }