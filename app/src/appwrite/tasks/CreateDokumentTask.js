import AppwriteTask from "./AppwriteTask.js";

export default class CreateDocumentTask extends AppwriteTask {

 async createResult(input) {
  let database = new this.appwrite.Databases(this.client, input.database);
   try {
   // Let appwrite create a unique id for this new document
   return await database.createDocument(input.collection, "unique", input.document);
  } catch (error) {
   console.log(error);
   throw new Error("Error while trying to create document on server");
  }
 }

}