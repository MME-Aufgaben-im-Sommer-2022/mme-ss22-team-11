import Config from "../../AppwriteConfig.js";
import AppwriteTask from "../AppwriteTask.js";

export default class UpdateFileTask extends AppwriteTask {

    async createResult(fileId, file) {
        let storage = new this.appwrite.Storage(this.client);
        try {
            await storage.updateFile(Config.storage, fileId, file);
        } catch (error) {
            throw new Error("Error while trying to update a file.");
        }
    }
    
}