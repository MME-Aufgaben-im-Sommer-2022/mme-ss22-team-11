import AppwriteConnector from '../appwrite/AppwriteConnector.js'
import Observable, { Event } from '../utils/Observable.js'
import { User } from './user.js'

// soll in index.js benutzt werden um den user festzustellen

const MIN_PASSWORD_LENGTH = 8

class Login extends Observable {
  constructor () {
    super()
    this.appwrite = new AppwriteConnector()
  }

  async singUp (username, email, password) {
    // eslint-disable-next-line no-magic-numbers
    if (password.length < MIN_PASSWORD_LENGTH) {
      // Error message in UI?
      return
    }
    await this.appwrite.createAccount(username, email, password)
    await this.appwrite.createSession(email, password)
    const user = new User(email, username)
    const toSave = user.toSavedObj()
    await this.appwrite.setPreferences(toSave)
    this.notifyAll(new Event('LOGIN', user))
  }

  async login (email, password) {
    this.appwrite.createSession(email, password)
    const json = await this.appwrite.getPreferences()
    const user = new User(email, json.username)

    user.createdCocktails = json.createdCocktails
    user.favorites = json.favorites
    user.blackListedIngredients = json.blackListedIngredients
    user.givenRatings = json.givenRatings

    this.notifyAll(new Event('LOGIN', user))
  }

  // wenn sich was am user ändert, wird diese Methode aufgerufen
  async updateUser (data) {
    await this.appwrite.setPreferences(data)
  }

  // für anonyme Nutzer
  getDefaultUser () {
    return new User(undefined, undefined, undefined)
  }
}

export { Login }
