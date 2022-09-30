import AppwriteTask from "./AppwriteTask.js";

export default class GetUserPrefrencesTask extends AppwriteTask {

 async createResult(input) { // eslint-disable-line no-unused-vars
  let account = new this.appwrite.Account(this.client);
  try {
   return await account.getPrefs();
  } catch (error) {
   console.log(error);
   throw new Error("Error while trying to get user preferences");
  }
 }

}