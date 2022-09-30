import AppwriteTask from "./AppwriteTask.js";

/**
 * Überschreibt die Preferences des angemeldeten Accounts auf dem Appwrite-Server
 */
export default class UpdateUserPreferencesTask extends AppwriteTask {

 /**
* Speichert die übergebenen Preferences für den aktuellen Account auf dem Server (bestehende Preferences werden überschrieben)
* @param {Object} input 
* @param {Object} input.preferences Die neuen Preferences,die auf dem Server gespeichert werden sollen
* @returns Die neu auf dem Server gespeicherten Preferences
* @throws Fehler, die beim Überschreiben der Preferences auftreten
*/
 async createResult(input) {
  let account = new this.appwrite.Account(this.client);
  try {
   return await account.updatePrefs(input.preferences);
  } catch (error) {
   console.log(error); // eslint-disable-line no-console
   throw new Error("Error while trying to update user preferences");
  }
 }

}