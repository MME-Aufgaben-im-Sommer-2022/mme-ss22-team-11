/* global Appwrite */

/**
 * Vorlage für alle Tasks zur Kapselung unabhängiger Datenbankoperationen. Beim Erstellen des
 * Tasks wird der Appwrite-Client übergeben. Weitere, zur Ausführung notwendige Parameter, erhält
 * die run-Methode in Form eines Parameter-Objekts. In dieser Methode wird die createResult-Methode
 * ausgeführt und deren Ergebnis zurückgegeben. Spezifische Tasks überschreiben createResult zur
 * Generierung der jeweiligen Ergebnisse. Tasks sind als "single-use"-Komponenten gedacht.
 */
class AppwriteTask {

 #consumed;

 constructor(client) {
  this.appwrite = Appwrite;
  this.client = client;
  this.#consumed = false;
 }

 async run(input) {
  if (this.#consumed === true) {
   throw new Error("Tasks can only be executed once");
  }
  try {
   let result = await this.createResult(input);
   this.#consumed = true;
   return result;
  } catch (error) {
   this.#consumed = true;
   throw error;
  }
 }

 /**
  * Diese Methode wird in jedem spezifischen Task überschrieben. Dabei werden notwendige Informationen
  * von der aufrufenden run-Methode als Eigenschaften eines Parameter-Objekts übergeben. Die Methode gibt das 
  * (asynchron) generierte Ergebnisse an die aufrufende "run"-Methode zurück. Auf den Appwrite-Namespace kann 
  * über this.appwrite zugegriffen werden. Auf den bereits initialisierten und im Konstruktor übergebenen
  * Appwrite-Client kann über this.client zugegriffen werden. 
  */
 async createResult(input) { // eslint-disable-line no-unused-vars
  throw new Error("Missing result creation in task");
 }

}

export default AppwriteTask;