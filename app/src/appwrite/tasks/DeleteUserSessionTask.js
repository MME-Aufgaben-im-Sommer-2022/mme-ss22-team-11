import AppwriteTask from "./AppwriteTask.js";

/**
 * Beendet eine aktuelle Sitzung auf dem Appwrite-Server
 */
export default class DeleteUserSessionTask extends AppwriteTask {

 /**
 * Beende die in input spezifizierte Sitzung 
 * @param {Object} input 
 * @param {String} input.session Die zu beendenden Sitzung
 * @returns -
 * @throws Fehler, die beim Beenden der Sitzung auftreten
 */
 async createResult(input) {
  let account = new this.appwrite.Account(this.client);
  try {
   await account.deleteSession(input.session.$id);
   return;
  } catch (error) {
   console.log(error); // eslint-disable-line no-console
   throw new Error("Error while trying to delete user session");
  }
 }

}