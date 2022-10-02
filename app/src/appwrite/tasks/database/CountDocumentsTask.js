import Config from "../../AppwriteConfig.js";
import AppwriteTask from "../AppwriteTask.js";

export default class CountDocumentsTask extends AppwriteTask {

    async createResult() {
        let database = new this.appwrite.Databases(this.client, Config.database.id);
        console.log(database);
        try {
            return await database.listDocuments(Config.database.id, Config.database.collections.recipe.id);
        } catch (error) {
            console.log(error);
            throw new Error("Team11: Something went wrong");
        }
    }
}