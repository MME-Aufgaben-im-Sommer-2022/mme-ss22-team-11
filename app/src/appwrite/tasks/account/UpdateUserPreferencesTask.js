import AppwriteTask from "../AppwriteTask.js";

export default class UpdateUserPrefrencesTask extends AppwriteTask {

 async createResult(input) {
  let account = new this.appwrite.Account(this.client);
  try {
   return await account.updatePrefs(input.preferences);
  } catch (error) {
   console.log(error);
   throw new Error("Error while trying to update user preferences");
  }
 }

}