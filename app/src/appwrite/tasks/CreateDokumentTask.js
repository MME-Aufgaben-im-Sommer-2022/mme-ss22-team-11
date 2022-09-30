import AppwriteTask from "./AppwriteTask.js";

/**
 * Speichert ein Dokument in der Appwrite-Datenbank
 */
export default class CreateDocumentTask extends AppwriteTask {

 /**
  * Speichert das in input übergebene Dokument in der spezifizierten Datenbank
  * @param {Object} input 
  * @param {String} input.database ID der Datenbank, in der das Dokument gespeichert werden soll
  * @param {String} input.collection ID der Collection, in der das Dokument gespeichert werden soll
  * @param {Object} input.document Das Dokument, das in der Datenbank gespeichert werden soll
  * @returns Das dann gespeicherte Dokument
  * @throws Fehler, die beim Speichern in der Datenbank auftreten
  */
 async createResult(input) {
  let database = new this.appwrite.Databases(this.client, input.database);
   try {
   // Appwrite erzeugt automatisch eine eindeutige ID für jedes neue Dokument
   return await database.createDocument(input.collection, "unique()", input.document);
  } catch (error) {
   console.log(error); // eslint-disable-line no-console
   throw new Error("Error while trying to create document on server");
  }
 }

}