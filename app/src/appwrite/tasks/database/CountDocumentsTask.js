import Config from '../../AppwriteConfig.js'
import AppwriteTask from '../AppwriteTask.js'

export default class CountDocumentsTask extends AppwriteTask {
  async createResult () {
    const database = new this.appwrite.Databases(this.client, Config.database.id)
    try {
      return await database.listDocuments(Config.database.collections.recipe.id)
    } catch (error) {
      throw new Error('Custom Error: Error while trying to count documents in the database.' + error)
    }
  }
}
