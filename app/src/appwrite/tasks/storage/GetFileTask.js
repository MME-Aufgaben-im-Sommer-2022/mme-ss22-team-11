import Config from '../../AppwriteConfig.js'
import AppwriteTask from '../AppwriteTask.js'

export default class GetFileTask extends AppwriteTask {
  async createResult (input) {
    const storage = new this.appwrite.Storage(this.client)
    try {
      return await storage.getFilePreview(Config.storage, input.id)
    } catch (error) {
      return 'NO FILE'
    }
  }
}
