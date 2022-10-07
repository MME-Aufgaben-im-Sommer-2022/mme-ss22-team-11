import AppwriteTask from '../AppwriteTask.js'

export default class CreateUserSessionTask extends AppwriteTask {
  async createResult (input) {
    const account = new this.appwrite.Account(this.client)
    try {
      const session = await account.createEmailSession(input.email, input.password)
      return session
    } catch (error) {
      throw new Error('Custom Error: Error while trying to create new user session.' + error)
    }
  }
}
