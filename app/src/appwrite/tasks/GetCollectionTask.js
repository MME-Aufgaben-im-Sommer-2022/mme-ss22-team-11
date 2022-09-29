import AppwriteTask from "./AppwriteTask.js";

export default class GetCollectionTask extends AppwriteTask {

 async createResult(input) {
  let database = new this.appwrite.Databases(this.client, input.database);
   try {
   // Let appwrite create a unique id for this new document
   let documentList =  await database.listDocuments(input.collection, [], 100);
   // TODO Retrieve all results with multiple paginated requests
   return documentList;
  } catch (error) {
   console.log(error);
   throw new Error("Error while trying to retrieve collection from server");
  }
 }

}