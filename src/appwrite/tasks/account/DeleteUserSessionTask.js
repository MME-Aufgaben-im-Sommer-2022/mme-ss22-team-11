import AppwriteTask from '../AppwriteTask.js'

export default class DeleteUserSessionTask extends AppwriteTask {
  async createResult (input) {
    const account = new this.appwrite.Account(this.client)
    try {
      await account.deleteSession(input.session.$id)
      return
    } catch (error) {
      throw new Error('Custom Error: Error while trying to terminate a user session' + error)
    }
  }
}
