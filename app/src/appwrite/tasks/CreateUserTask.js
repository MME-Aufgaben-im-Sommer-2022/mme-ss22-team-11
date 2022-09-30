import AppwriteTask from "./AppwriteTask.js";

/**
 * Registriert einen neuen Account mit E-Mail, Name und Passwort auf dem Appwrite-Server
 */
export default class CreateUserTask extends AppwriteTask {

 /**
  * Registriert den in input spezifizierten Account am Appwrite-Server an
  * @param {Object} input 
  * @param {String} input.email E-Mail-Adresse des zu registrierenden Accounts
  * @param {String} input.passwort Passwort des zu registrierenden Accounts
  * @param {String} input.name Name des zu registrierenden Accounts
  * @returns Der neu erzeugte Account
  * @throws Fehler, die beim Registrieren auf dem Server auftreten
  */
 async createResult(input) {
  let account = new this.appwrite.Account(this.client);
  try {
   // Let appwrite create a unique id for this new user
   await account.create("unique()", input.email, input.password, input.name);
   return account;
  } catch (error) {
   console.log(error); // eslint-disable-line no-console
   throw new Error("Error while trying to create new account");
  }
 }

}