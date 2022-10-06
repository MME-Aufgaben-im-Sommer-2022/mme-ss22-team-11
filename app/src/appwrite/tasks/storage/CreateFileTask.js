import Config from "../../AppwriteConfig.js";
import AppwriteTask from "../AppwriteTask.js";

export default class CreateFileTask extends AppwriteTask {

    async createResult(input) {
        let storage = new this.appwrite.Storage(this.client);
        try {
            await storage.createFile(Config.storage, input.fileId, input.file);
        } catch (error) {
            throw new Error("Error while trying to create a file." + error);
        }
    }
    
}