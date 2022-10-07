import Config from '../../AppwriteConfig.js'
import AppwriteTask from '../AppwriteTask.js'

export default class CreateDocumentTask extends AppwriteTask {
  async createResult (input) {
    const database = new this.appwrite.Databases(this.client, Config.database.id)
    try {
      await database.createDocument(Config.database.collections.recipe.id, input.id, input.data)
    } catch (error) {
      throw new Error('Custom Error: Error while trying to create a document.' + error)
    }
  }
}
