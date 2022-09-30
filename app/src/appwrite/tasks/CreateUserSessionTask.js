import AppwriteTask from "./AppwriteTask.js";

/**
 * Meldete einen Account über E-Mail und Passwort am Appwrite-Server an und erzeugt 
 * damit eine neue Session
 */
export default class CreateUserSessionTask extends AppwriteTask {

 /**
  * Meldet den in input spezifizierten Account am Appwrite-Server an
  * @param {Object} input 
  * @param {String} input.email E-Mail-Adresse des anzumeldenden Accounts
  * @param {String} input.passwort Passwort des anzumeldenden Accounts
  * @returns Die neu erzeugte Sitzung des jetzt angemeldeten Accounts
  * @throws Fehler, die beim Anmelden auf dem Server auftreten
  */
 async createResult(input) {
  let account = new this.appwrite.Account(this.client);
  try {
   let session = await account.createEmailSession(input.email, input.password);
   return session;
  } catch (error) {
   console.log(error); // eslint-disable-line no-console
   throw new Error("Error while trying to create user session");
  }
 }

}