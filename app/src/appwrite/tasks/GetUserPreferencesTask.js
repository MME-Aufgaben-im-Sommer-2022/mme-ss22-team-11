import AppwriteTask from "./AppwriteTask.js";

/**
 * Gibt die aktuellen Preferences des angemeldeten Accounts zurück
 */
export default class GetUserPreferencesTask extends AppwriteTask {

 /**
* Gibt die Preferences des aktuell angemeldeten Accounts zurück
* @returns Die  Preferences des aktuell angemeldeten Accounts
* @throws Fehler, die beim Zugriff auf die Preferences auftreten
*/
 async createResult(input) { // eslint-disable-line no-unused-vars
  let account = new this.appwrite.Account(this.client);
  try {
   return await account.getPrefs();
  } catch (error) {
   console.log(error); // eslint-disable-line no-console
   throw new Error("Error while trying to get user preferences");
  }
 }

}