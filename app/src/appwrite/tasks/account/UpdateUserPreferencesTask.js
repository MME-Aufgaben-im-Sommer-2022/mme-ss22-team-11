import AppwriteTask from "../AppwriteTask.js";

export default class UpdateUserPrefrencesTask extends AppwriteTask {

 async createResult(input) {
  let account = new this.appwrite.Account(this.client);
  try {
   return await account.updatePrefs(input.preferences);
  } catch (error) {
   throw new Error("Custom Error: Error while trying to update user preferences." + error);
  }
 }

}