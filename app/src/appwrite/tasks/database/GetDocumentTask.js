import Config from "../AppwriteConfig.js";
import AppwriteTask from "./AppwriteTask.js";

export default class GetDocumentTask extends AppwriteTask {

  async createResult(input) {
    let database = new this.appwrite.Databases(this.client, Config.database.id);
    try {
      return await database.getDocument(Config.database.collections.recipe.id, input.id);
    } catch (error) {
      console.error(error);
      return undefined;
      throw new Error("Error while trying to get a document.");
    }
  }

}