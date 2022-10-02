import Config from "../../AppwriteConfig.js";
import AppwriteTask from "../AppwriteTask.js";

export default class ListDocumentsTask extends AppwriteTask {

  async createResult(query) {
    let database = new this.appwrite.Databases(this.client, Config.database.id);
    try {
      return await database.listDocuments(Config.database.collections.recipe.id);
      // return await database.listDocuments(Config.database.collections.recipe.id, [this.appwrite.Query.equal(query)]);
      // return await database.listDocuments(Config.database.collections.recipe.id, [this.appwrite.Query.limit(100)]);
      console.log(database);
      /*
      return await database.listDocuments(
        Config.database.collections.recipe.id,
        [
          this.appwrite.Query.greaterThanEqual("id", 0),
          this.appwrite.Query.lessThan("id", 100),
          this.appwrite.Query.limit(100),
        ]);
      */
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

}