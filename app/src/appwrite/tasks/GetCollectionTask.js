import AppwriteTask from "./AppwriteTask.js";

const NUM_DOCUMENTS_PER_REQUEST = 100;

/**
 * Gibt alle Dokumente einer spezifizierten Collection auf dem Appwrite-Server zurück
 */
export default class GetCollectionTask extends AppwriteTask {

 /**
* Gibt eine Collection aus Dokumenten zurück
* @param {Object} input 
* @param {String} input.database ID der Datenbank, aus der die Dokumente bezogen werden sollen
* @param {String} input.collection ID der Collection, aus der die Dokumente bezogen werden sollen
* @returns Die Collection der bezogenen Dokumente
* @throws Fehler, die beim Zugriff auf die Dokumente auftreten
*/
 async createResult(input) {
  let database = new this.appwrite.Databases(this.client, input.database);
  try {
   // Let appwrite create a unique id for this new document
   let documentList = await database.listDocuments(input.collection, [], NUM_DOCUMENTS_PER_REQUEST);
   // TODO Retrieve all results with multiple paginated requests
   return documentList;
  } catch (error) {
   console.log(error); // eslint-disable-line no-console
   throw new Error("Error while trying to retrieve collection from server");
  }
 }

}