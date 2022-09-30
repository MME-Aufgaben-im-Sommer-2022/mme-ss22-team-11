import Config from "../../AppwriteConfig.js";
import AppwriteTask from "../AppwriteTask.js";

export default class GetFileTask extends AppwriteTask {

    async createResult(fileId) {
        let storage = new this.appwrite.Storage(this.client);
        try {
            return await storage.getFile(Config.storage, fileId);
        } catch (error) {
            return "NO FILE";
        }
    }
    
}