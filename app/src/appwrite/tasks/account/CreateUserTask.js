import AppwriteTask from "../AppwriteTask.js";

export default class CreateUserTask extends AppwriteTask {

 async createResult(input) {
  let account = new this.appwrite.Account(this.client);
  try {
   // Let appwrite create a unique id for this new user
   await account.create("unique()", input.email, input.password, input.name); 
   return account;
  } catch (error) {
   throw new Error("Custom Error: Error while trying to create new account" + error);
  }
 }

}