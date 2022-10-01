import Config from "../../AppwriteConfig.js";
import AppwriteTask from "../AppwriteTask.js";

export default class ListDocumentsTask extends AppwriteTask {

    async createResult(query) {
      let database = new this.appwrite.Databases(this.client, Config.database.id);
      try {
        return await database.listDocuments(Config.database.collections.recipe.id, this.appwrite.Query.equal(query));
      } catch (error) {
        console.log(error);
        return undefined;
      }
    }
  
  }