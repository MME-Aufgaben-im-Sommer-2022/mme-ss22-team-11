import Config from "../AppwriteConfig.js";
import AppwriteTask from "./AppwriteTask.js";

export default class UpdateDocumentTask extends AppwriteTask {

  async createResult(input) {
    let database = new this.appwrite.Databases(this.client, Config.database.id);
    try {
      await database.updateDocument(Config.database.collections.recipe, input.id, input.data); 
    } catch (error) {
      console.error(error);
      throw new Error("Error while trying to update a document.");
    }
  }

}