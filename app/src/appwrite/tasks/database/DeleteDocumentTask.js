import Config from "../../AppwriteConfig.js";
import AppwriteTask from "../AppwriteTask.js";

export default class DeleteDocumentTask extends AppwriteTask {

  async createResult(input) {
    let database = new this.appwrite.Databases(this.client, Config.database.id);
    try {
      await database.deleteDocument(Config.database.collections.recipe.id, input.id);
    } catch (error) {
      throw new Error("Custom Error: Error while trying to create a document." + error);
    }
  }

}