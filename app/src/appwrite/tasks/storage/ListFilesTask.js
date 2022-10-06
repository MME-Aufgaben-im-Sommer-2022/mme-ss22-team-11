import Config from "../../AppwriteConfig.js";
import AppwriteTask from "../AppwriteTask.js";

export default class ListFilesTask extends AppwriteTask {

    async createResult() {
        let storage = new this.appwrite.Storage(this.client);
        try {
            return await storage.listFiles(Config.storage);
        } catch (error) {
            return undefined;
        }
    }
    
}