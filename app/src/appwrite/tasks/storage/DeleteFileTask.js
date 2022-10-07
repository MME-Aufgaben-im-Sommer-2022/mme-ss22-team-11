import Config from "../../AppwriteConfig.js";
import AppwriteTask from "../AppwriteTask.js";

export default class DeleteFileTask extends AppwriteTask {

    async createResult(fileId) {
        let storage = new this.appwrite.Storage(this.client);
        try {
            await storage.deleteFile(Config.storage, fileId);
        } catch (error) {
            throw new Error("Custom Error: Error while trying to delete a file." + error);
        }
    }
    
}