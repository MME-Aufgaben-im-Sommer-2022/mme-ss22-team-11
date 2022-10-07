import Config from "../../AppwriteConfig.js";
import AppwriteTask from "../AppwriteTask.js";

const max = 25;

export default class ListDocumentsTask extends AppwriteTask {

  async createResult(input) {
    let database = new this.appwrite.Databases(this.client, Config.database.id);
    try {
      //return await database.listDocuments(Config.database.collections.recipe.id);
      // return await database.listDocuments(Config.database.collections.recipe.id, [this.appwrite.Query.equal(query)]);
      // return await database.listDocuments(Config.database.collections.recipe.id, [this.appwrite.Query.limit(100)]);
      return await database.listDocuments(
        Config.database.collections.recipe.id,
        [
          this.appwrite.Query.greaterEqual("id", input.query - max),
          this.appwrite.Query.lesser("id", input.query),
        ]);
    } catch (error) {
      return undefined;
    }
  }

}