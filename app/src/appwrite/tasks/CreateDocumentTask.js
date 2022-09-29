import Config from "../AppwriteConfig.js";
import AppwriteTask from "./AppwriteTask.js";

export default class CreateDocumentTask extends AppwriteTask {

  async createResult(id, data) {
    let database = new this.appwrite.Databases(this.client, Config.database);
    try {
      await database.createDocument(Config
      .recipe, id, data); // Config.collections.recipe ??
    } catch (error) {
      console.error(error);
      throw new Error("Error while trying to create a document.");
    }
  }

}