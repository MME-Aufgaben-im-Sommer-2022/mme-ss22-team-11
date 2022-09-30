import Config from "../../AppwriteConfig.js";
import AppwriteTask from "../AppwriteTask.js";

export default class CreateFileTask extends AppwriteTask {

    async createResult(fileId, file) {
        let storage = new this.appwrite.Storage(this.client);
        try {
            await storage.createFile(Config.storage, fileId, file);
        } catch (error) {
            throw new Error("Error while trying to create a file.");
        }
    }
    
}