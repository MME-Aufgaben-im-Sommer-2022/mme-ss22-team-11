/* global Appwrite */

import Config from "./AppwriteConfig.js";
import CreateUserTask from "./tasks/CreateUserTask.js";
import CreateUserSessionTask from "./tasks/CreateUserSessionTask.js";
import DeleteUserSessionTask from "./tasks/DeleteUserSessionTask.js";
import GetUserPreferencesTask from "./tasks/GetUserPreferencesTask.js";
import UpdateUserPreferencesTask from "./tasks/UpdateUserPrefrencesTask.js";
import CreateDocumentTask from "./tasks/CreateDokumentTask.js";

function createClient() {
  let client = new Appwrite.Client();
  client.setEndpoint(Config.endpoint).setProject(Config.project);
  return client;
}

/**
 * Der AppwriteConnector bildet die Brücke zwischen der Appwrite-Datenbank auf dem Server und
 * der Client-Anwendung im Browser. Für alle zentralen DB-Anfragen ist hier eine öffentliche,
 * asynchrone Methode definiert, in der die gesamte Kommunikation mit dem Appwrite-Server
 * durchgeführt und ein passendes Ergebnis generiert wird. Die eigentlichen Operationen sind dabei
 * in separate Task-Objekte ausgelagert. Dieser erhalten zur Durchführung (run-Methode) alle
 * Parameter übergeben, die neben dem bereits beim Erstellen des Tasks übergebenen, aktuellen
 * Appwrite-Client, für die Durchführung der spezifischen Aufgabe notwendig sind.
 * 
 * Werden während der weiteren Implementierung der Anwendung weitere Aufgaben bzw. Aktionen mit
 * der Appwrite-Datenbank notwendig, so werden diese wie folgt ergänzt:
 * 
 * - Unter "tasks" wird ein neues Modul für die jeweilige Aufgabe erstellt
 * - Im neuen Modul wird eine neues Task-Objekt durch Erweiterung von AppwriteTask erstellt
 * - Im neuen Task-Objekt muss nur die createResult-Methode überschrieben und dort das spezifische
 * Verhalten dieses Tasks implementiert werden
 * - Im AppwriteConnector wird eine neue, öffentliche Methode ergänzt, mit der der neue Task in der 
 * restlichen Anwendung verwendet werden kann. Notwendige, externe Informationen werden als Parameter 
 * an die Methode übergeben. In der Methode wird das neue Task-Objekt erstellt, dessen run-Methode 
 * ausgeführt und das asynchron produzierte Ergebnisse innerhalb des Connectors weiterverarbeitet
 * oder direkt an die aufrufende Stelle weitergegeben.
 */
class AppwriteConnector {

  constructor() {
    this.client = createClient(); // erstellt ein Appwrite.Client-Objekt für den Zugriff auf den Server
    this.currentSession = undefined; // Enthält, falls vorhanden, die Session-Informationen des aktuell eingeloggten Users
  }

  /**
   * Erzeugt einen neuen Account auf dem Appwrite-Server
   * @param {*} name Der Name des neuen Accounts
   * @param {*} email Die E-Mail-Adresse des neuen Accounts
   * @param {*} password Das Passwort des neuen Accounts
   * @returns Den neu erstellten Account
   * @throws Fehler, die beim Erstellen des Accounts aufgetreten sind
   */
  async createAccount(name, email, password) {
    let task = new CreateUserTask(this.client);
    return await task.run({
      email: email,
      password: password,
      name: name,
    });
  }

  /**
   * Meldet einen bestehenden, über die Parameter authentifizierten, Account beim Appwrite-Server an
   * @param {*} email Die E-Mail-Adresse des anzumeldenden Accounts
   * @param {*} password Das Passwort des anzumeldenten Accounts
   * @returns Die durch den Anmeldevorgang erzeugte Sitzung als Session-Objekt
   * @throws Fehler, die beim Anmelden des Accounts aufgetreten sind
   */
  async createSession(email, password) {
    let task = new CreateUserSessionTask(this.client);
    /**
     * Die jeweils aktuelle Sitzung wird auch im AppwriteConnector gespeichert, um diese Informationen
     * bei Bedarf an weitere Tasks weiter geben zu können.
     */
    this.currentSession = await task.run({
      email: email,
      password: password,
    });
    return this.currentSession;
  }

  /**
   * Meldet den aktuell angemeldeten Account beim Appwrite-Server an und zersört damit die aktuelle Sitzung
   * @returns -
   * @throws Fehler, die beim Abmelden des Accounts aufgetreten sind
   */
  async deleteSession() {
    let task = new DeleteUserSessionTask(this.client);
    await task.run({
      session: this.currentSession,
    });
    // Nach Abmeldung wird zusätzlich die lokal gespeicherte Sitzung entfernt
    this.currentSession = undefined;
    return;
  }

  /**
   * Gibt die Preferences des angemeldeten Accounts als JavaScript-Objekt zurück
   * @returns Die aktuellen Prefernces des angemeldeten Accounts
   * @throws Fehler, die beim Zugriff auf die Preferences aufgetreten sind
   */
  async getPreferences() {
    let task = new GetUserPreferencesTask(this.client);
    return await task.run({});
  }

  /**
   * Überschreibt die Preferences des angemeldeten Accounts mit dem übergebenen Objekt
   * @param {*} preferences Das JavaScript-Objekt, dass die Preferences des Accounts auf dem Server ersetzen soll
   * @returns Die jetzt überschriebenen, aktuellen Preferences des angemeldeten Accounts
   * @throws  Fehler, die beim Überschreiben der Preferences aufgetreten sind
   */
  async setPreferences(preferences) {
    let task = new UpdateUserPreferencesTask(this.client);
    return await task.run({
      preferences: preferences,
    });
  }

  async createRecipeOnServer(recipe) {
    let task = new CreateDocumentTask(this.client);
    return await task.run({
      database: Config.database.id,
      collection: Config.database.collections.recipes.id,
      document: recipe,
    });
  }

}

const connector = new AppwriteConnector();
// Aus dem Modul wird nur der bereits erstellte Connector exportiert, um eine mehrfache Instanzierung zu verhindern
export default connector;