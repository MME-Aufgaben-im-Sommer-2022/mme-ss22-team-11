/* global Appwrite */

import Config from './AppwriteConfig.js'
import CreateUserTask from './tasks/account/CreateUserTask.js'
import CreateUserSessionTask from './tasks/account/CreateUserSessionTask.js'
import DeleteUserSessionTask from './tasks/account/DeleteUserSessionTask.js'
import GetUserPreferencesTask from './tasks/account/GetUserPreferencesTask.js'
import UpdateUserPreferencesTask from './tasks/account/UpdateUserPreferencesTask.js'
import CreateDocumentTask from './tasks/database/CreateDocumentTask.js'
import GetDocumentTask from './tasks/database/GetDocumentTask.js'
import UpdateDocumentTask from './tasks/database/UpdateDocumentTask.js'
import DeleteDocumentTask from './tasks/database/DeleteDocumentTask.js'
import ListDocumentsTask from './tasks/database/ListDocumentsTask.js'
import CountDocumentsTask from './tasks/database/CountDocumentsTask.js'
import CreateFileTask from './tasks/storage/CreateFileTask.js'
import ListFilesTask from './tasks/storage/ListFilesTask.js'
import GetFileTask from './tasks/storage/GetFileTask.js'
import UpdateFileTask from './tasks/storage/UpdateFileTask.js'
import DeleteFileTask from './tasks/storage/DeleteFileTask.js'

function createClient () {
  const client = new Appwrite.Client()
  client.setEndpoint(Config.endpoint).setProject(Config.project)
  return client
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
  constructor () {
    this.client = createClient() // erstellt ein Appwrite.Client-Objekt für den Zugriff auf den Server
    this.currentSession = undefined // Enthält, falls vorhanden, die Session-Informationen des aktuell eingeloggten Users
  }

  /**
   * Erzeugt einen neuen Account auf dem Appwrite-Server
   * @param {*} name Der Name des neuen Accounts
   * @param {*} email Die E-Mail-Adresse des neuen Accounts
   * @param {*} password Das Passwort des neuen Accounts
   * @returns Den neu erstellten Account
   * @throws Fehler, die beim Erstellen des Accounts aufgetreten sind
   */
  async createAccount (name, email, password) {
    const task = new CreateUserTask(this.client)
    return await task.run({
      email,
      password,
      name
    })
  }

  /**
   * Meldet einen bestehenden, über die Parameter authentifizierten, Account beim Appwrite-Server an
   * @param {*} email Die E-Mail-Adresse des anzumeldenden Accounts
   * @param {*} password Das Passwort des anzumeldenten Accounts
   * @returns Die durch den Anmeldevorgang erzeugte Sitzung als Session-Objekt
   * @throws Fehler, die beim Anmelden des Accounts aufgetreten sind
   */
  async createSession (email, password) {
    const task = new CreateUserSessionTask(this.client)
    /**
     * Die jeweils aktuelle Sitzung wird auch im AppwriteConnector gespeichert, um diese Informationen
     * bei Bedarf an weitere Tasks weiter geben zu können.
     */
    this.currentSession = await task.run({
      email,
      password
    })
    return this.currentSession
  }

  /**
   * Meldet den aktuell angemeldeten Account beim Appwrite-Server an und zersört damit die aktuelle Sitzung
   * @returns -
   * @throws Fehler, die beim Abmelden des Accounts aufgetreten sind
   */
  async deleteSession () {
    const task = new DeleteUserSessionTask(this.client)
    await task.run({
      session: this.currentSession
    })
    // Nach Abmeldung wird zusätzlich die lokal gespeicherte Sitzung entfernt
    this.currentSession = undefined
  }

  /**
   * Gibt die Preferences des angemeldeten Accounts als JavaScript-Objekt zurück
   * @returns Die aktuellen Prefernces des angemeldeten Accounts
   * @throws Fehler, die beim Zugriff auf die Preferences aufgetreten sind
   */
  async getPreferences () {
    const task = new GetUserPreferencesTask(this.client)
    return await task.run({})
  }

  /**
   * Überschreibt die Preferences des angemeldeten Accounts mit dem übergebenen Objekt
   * @param {*} preferences Das JavaScript-Objekt, dass die Preferences des Accounts auf dem Server ersetzen soll
   * @returns Die jetzt überschriebenen, aktuellen Preferences des angemeldeten Accounts
   * @throws  Fehler, die beim Überschreiben der Preferences aufgetreten sind
   */
  async setPreferences (preferences) {
    const task = new UpdateUserPreferencesTask(this.client)
    return await task.run({
      preferences
    })
  }

  /**
   * Erstellt ein Dokument welches in der Datenbank gespeichert wird
   * @param {*} id Ein String um das Dokument zu identifizieren
   * @param {*} data Ein JSON-Objekt welches unter der id gespeichert wird
   * @returns
   */
  async createDocument (id, data) {
    const task = new CreateDocumentTask(this.client)
    return await task.run({
      id,
      data
    })
  }

  /**
   * Listet alle Dokumente aus der Datenbank auf
   * @returns eine Liste mit allen Dokumenten aus der Datenbank
   */
  async listDocuments (query) {
    const task = new ListDocumentsTask(this.client)
    return await task.run({
      query
    })
  }

  /**
   * Gibt zurück, wie viele Dokumente existieren.
   */
  async countDocuments () {
    const task = new CountDocumentsTask(this.client)
    return await task.run({})
  }

  /**
   * Gibt das gesuchte Dokument zurück
   * @param {*} id Ein String um das Dokument zu spezifizieren
   * @returns JSON-Objekt welches unter der id gespeichert ist
   */
  async getDocument (id) {
    const task = new GetDocumentTask(this.client)
    return await task.run({
      id
    })
  }

  /**
   * Ersetzt ein vorhandenes Dokument mit neuen Daten
   * @param {*} id Identifikation für das Dokument
   * @param {*} data Neue Daten in JSON-Format
   * @returns
   */
  async updateDocument (id, data) {
    const task = new UpdateDocumentTask(this.client)
    return await task.run({
      id,
      data
    })
  }

  /**
   * Löscht das gewünschte Dokument
   * @param {*} id Identifikation für das Dokument
   * @returns
   */
  async deleteDocument (id) {
    const task = new DeleteDocumentTask(this.client)
    return await task.run({
      id
    })
  }

  /**
   * Erstellt ein File welches in der Storage gespeichert wird
   * @param {*} id Identifikation für das File
   * @param {*} file File Objekt welches gespeichert wird
   * @returns
   */
  async createFile (id, file) {
    const task = new CreateFileTask(this.client)
    return await task.run({
      id,
      file
    })
  }

  /**
   * Gibt eine Liste zurück, die zeigt welche Files in der Storage sind
   * @returns
   */
  async listFiles () {
    const task = new ListFilesTask(this.client)
    return await task.run({})
  }

  /**
   * Gibt das gesuchte File zurück
   * @param {*} id Identifikation für das gewünschte File
   * @returns File-Objekt
   */
  async getFile (id) {
    const task = new GetFileTask(this.client)
    return await task.run({
      id
    })
  }

  /**
   * Ersetzt ein vorhandenes File mit einem neuen
   * @param {*} id Identifikation des Files
   * @param {*} file Neues File-Objekt
   * @returns
   */
  async updateFile (id, file) {
    const task = new UpdateFileTask(this.client)
    return await task.run({
      id,
      file
    })
  }

  /**
   * Löscht ein File aus der Storage
   * @param {*} id Identifkation des Files
   * @returns
   */
  async deleteFile (id) {
    const task = new DeleteFileTask(this.client)
    return await task.run({
      id
    })
  }
}

export default AppwriteConnector
