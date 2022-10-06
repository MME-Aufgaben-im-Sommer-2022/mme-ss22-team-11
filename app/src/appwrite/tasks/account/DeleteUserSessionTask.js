import AppwriteTask from "../AppwriteTask.js";

export default class DeleteUserSessionTask extends AppwriteTask {

 async createResult(input) {
  let account = new this.appwrite.Account(this.client);
  try {
   await account.deleteSession(input.session.$id); 
   return;
  } catch (error) {
   throw new Error("Error while trying to terminate a user session" + error);
  }
 }

}