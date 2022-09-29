import Config from "../AppwriteConfig.js";
import AppwriteTask from "./AppwriteTask.js";

export default class GetDocumentTask extends AppwriteTask {

  async createResult(id) {
    let database = new this.appwrite.Databases(this.client, Config.database);
    try {
<<<<<<< Updated upstream
      return await database.getDocument(Config.recipe, id); // Config.collections.recipe ??
=======
      return await database.getDocument(Config.collections.recipe, id);
>>>>>>> Stashed changes
    } catch (error) {
      console.error(error);
      throw new Error("Error while trying to get a document.");
    }
  }

}