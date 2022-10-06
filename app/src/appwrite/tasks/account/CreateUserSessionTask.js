import AppwriteTask from "../AppwriteTask.js";

export default class CreateUserSessionTask extends AppwriteTask {

 async createResult(input) {
  let account = new this.appwrite.Account(this.client);
  try {
   let session = await account.createEmailSession(input.email, input.password); 
   return session;
  } catch (error) {
   throw new Error("Error while trying to create new user session." + error);
  }
 }
}