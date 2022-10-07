import Config from '../../AppwriteConfig.js'
import AppwriteTask from '../AppwriteTask.js'

export default class UpdateFileTask extends AppwriteTask {
  async createResult (fileId, file) {
    const storage = new this.appwrite.Storage(this.client)
    try {
      await storage.updateFile(Config.storage, fileId, file)
    } catch (error) {
      throw new Error('Custom Error: Error while trying to update a file.' + error)
    }
  }
}
