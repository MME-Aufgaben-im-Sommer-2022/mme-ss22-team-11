import { Cocktail } from './cocktail.js'
import { Recipe } from './recipe.js'
import { Ingredient, IngredientList } from './ingredient.js'
import { Observable, Event } from '../utils/Observable.js'
import AppwriteConnector from '../appwrite/AppwriteConnector.js'

const BATCH_SIZE = 25

class CocktailListManager extends Observable {
  constructor () {
    super()

    this.appwrite = new AppwriteConnector()

    // wenn die CocktailID hier ist, muss mindestens eine Zutat ersetzt werden um der Suche zu entsprechen;
    this.markedIDs = []

    // TODO: aus Datenbank/API laden
    this.allCocktails = []
    this.ingredientList = new IngredientList()
    this.ingredientList.addEventListener('INGREDIENTS_READY', (event) => this.fillAllIngredients(event.data))
    this.ingredientList.getAllIngredientsFromJSON()
    this.substitutes = {}
    this.substitutedIngredients = []
    this.fillReplacements()

    // Diese Liste soll immer angezeigt werden
    this.displayList = this.allCocktails

    // TODO: listener hinzufügen um zu sehen wann daten bereit sind
  }

  fillReplacements () {
    fetch('./src/cocktailData/JSON/substitute.json')
      .then((response) => response.json())
      .then((json) => {
        // eslint-disable-next-line guard-for-in
        for (const i in json) {
          const data = json[i]
          this.substitutes[i] = data
        }
      })
  }

  onReadyForCocktails () {
    this.getCocktailsFromDB()
  }

  fillAllIngredients (data) {
    this.allIngredients = new IngredientList()
    data.forEach(el => this.allIngredients.addIngredient(el))
    this.notifyAll(new Event('READY_FOR_COCKTAILS'))
  }

  async emptyDB () {
    let docs = await this.appwrite.countDocuments()
    // console.log(docs);
    while (docs.total > 0) {
      docs.documents.forEach(data => {
        // console.log(data.$id);
        this.appwrite.deleteDocument(data.$id)
      })
      docs = await this.appwrite.countDocuments()
    }
  }

  // read all docs to get cocktails
  async getCocktailsFromDB () {
    // this.emptyDB();
    // return;
    const count = await this.appwrite.countDocuments()
    const docs = []
    let img
    let cocktail

    // if there are no Cocktails in the DB, the cocktails from the json will be loaded
    if (count.total === 0) {
      this.getIngredientAndCocktailData()
      return
    }

    this.getIngredientData()

    // console.log(count.total);

    for (let i = BATCH_SIZE; i <= count.total + BATCH_SIZE; i += BATCH_SIZE) {
      const batch = await this.appwrite.listDocuments(i)
      const batchDocs = batch.documents
      batchDocs.forEach(d => {
        if (d !== undefined) {
          docs.push(d)
        }
      })
    }

    docs.forEach(data => {
      // eslint-disable-next-line no-magic-numbers
      const id = data.$id.substring(10)
      const recipe = JSON.parse(data.recipe)
      const ratings = JSON.parse(data.ratings)
      const steps = {}
      let stepNr = 1
      data.steps.forEach(stepDesc => {
        steps[stepNr] = stepDesc
        stepNr += 1
      })

      img = data.image

      // TODO: Storage beim befüllen statt hier auslesen und datei aus Storage holen
      // TODO: beim erstellen von einem Cocktail soll "STORAGE" als img vom cocktail gespeichert werden
      // if (data.image == "STORAGE") {
      //    img = this.getImgForID(id, data.image);
      // } else {
      //    img = data.image;
      // }
      cocktail = new Cocktail(id, data.name, recipe, img, ratings, data.tags, data.description, steps, data.author)

      this.allCocktails.push(cocktail)
    })
    // console.log(this.allCocktails);
    this.allCocktails.sort((a, b) => a.id - b.id)
    this.updateDisplayList(this.allCocktails)
  }

  async getImgForID (id) {
    return await this.appwrite.getFile(id)
  }

  getAllCommunityCocktails () {
    const returnList = []
    // jeder Cocktail mit negativer ID ist von der Community
    this.allCocktails.forEach(cocktail => {
      if (cocktail.id < 0) {
        returnList.push(cocktail)
      }
    })
    return returnList
  }

  // TODO: fertig machen
  async cocktailsToJSON () {
    this.allCocktails.forEach(cocktail => {
      const id = 'cocktailNr' + cocktail.id
      const data = cocktail.toDBObject()
      this.addCocktailToDB(id, data)
    })
  }

  async addCocktailToDB (id, data) {
    if (await this.appwrite.getDocument(id) !== undefined) {
      return
    }
    await this.appwrite.createDocument(id, data)
  }

  getCocktailForID (id) {
    let ct

    console.log(this.allCocktails)

    this.allCocktails.forEach(cocktail => {
      if (id === cocktail.id) {
        ct = cocktail
        console.log(cocktail)
      }
    })
    return ct
  }

  // Soll Favoriten anzeigen
  getFavorites (idList) {
    const returnList = []

    idList.forEach(id => {
      this.allCocktails.forEach(cocktail => {
        if (id === cocktail.id) {
          returnList.push(cocktail)
        }
      })
    })

    return returnList
  }

  // TODO: ausführen, wenn eine neue Bewertung abgegeben wird
  rateCocktail (data) {
    this.allCocktails.forEach(cocktail => {
      if (cocktail.id === data.cocktailID) {
        cocktail.addRating(data.rating)
        // update cocktail in db
        this.updateCocktail(cocktail)
        this.notifyAll(new Event('COCKTAIL_RATED', cocktail))
      }
    })
  }

  deleteRating (data) {
    this.allCocktails.forEach(cocktail => {
      if (cocktail.id === data.cocktailID) {
        cocktail.deleteRating(data.email)
        this.updateCocktail(cocktail)
        this.notifyAll(new Event('RATING_DELETED'))
      }
    })
  }

  // database update
  async updateCocktail (cocktail) {
    const id = 'cocktailNr' + cocktail.id
    await this.appwrite.updateDocument(id, cocktail.toDBObject())
  }

  getIngredientAndCocktailData () {
    this.getIngredientData()
    this.getCocktailsFromJson()
  }

  getIngredientData () {
    fetch('./src/cocktailData/JSON/ingredients.json')
      .then((response) => response.json())
      .then((json) => {
        // eslint-disable-next-line guard-for-in
        for (const i in json) {
          const data = json[i]
          const alcoholic = data.alcoholic === 1
          this.ingredientList.addIngredient(new Ingredient(i, data.display_name, alcoholic))
        }
      })
  }

  // soll beim Event "COCKTAIL_CREATION_REQUESTED" ausgeführt werden
  addCustomCocktail (data) {
    // console.log(data);

    const name = data.name
    const recipe = data.recipe
    let image = data.image
    const tags = data.tags
    const description = data.description
    const steps = data.steps
    const author = data.username
    const id = this.getNewID()

    if (image !== 'NO_IMAGE') {
      this.appwrite.createFile(id, image)
      image = 'STORAGE'
    }

    // TODO: letzte id aus db auslesen (daraus neue errechnen)
    const cocktail = new Cocktail(id, name, recipe, image, [], tags, description, steps, author)

    // console.log(cocktail);
    this.allCocktails.push(cocktail)
    this.notifyAll(new Event('COCKTAIL_CREATION_DONE'), cocktail.id)
    // TODO: db aktualisieren
    const dbID = 'cocktailNr' + cocktail.id
    const dbData = cocktail.toDBObject()
    this.addCocktailToDB(dbID, dbData)
  }

  getNewID () {
    const ids = []
    this.allCocktails.forEach(cocktail => {
      ids.push(Number(cocktail.id))
    })
    const max = Math.max.apply(null, ids)
    return max + 1
  }

  addCocktailFromJSON (id, name, recipe, image, description, steps, author) {
    const newCocktail = new Cocktail(id, name, recipe, image, [], [], description, steps, author)
    this.allCocktails.push(newCocktail)
  }

  // TODO: auslagern, soll nur ausgeführt werden wenn Datenbank leer ist
  getCocktailsFromJson () {
    fetch('./src/cocktailData/JSON/recipes.json')
      .then((response) => response.json())
      .then((json) => {
        // eslint-disable-next-line guard-for-in
        for (const i in json) {
          const data = json[i]
          const recipe = this.getRecipeFromData(data)
          this.addCocktailFromJSON(i, data.name, recipe, data.img, data.description, data.steps, data.author)
        }
        this.cocktailsToJSON()
        this.notifyAll(new Event('DATA_READY'))
      })
  }

  updateDisplayList (returnList) {
    this.displayList = returnList
    this.notifyAll(new Event('DATA_UPDATED'))
  }

  async deleteCocktail (id) {
    await this.appwrite.deleteDocument(id)
    this.allCocktails = []
    this.getCocktailsFromDB()
  }

  searchCocktailByName (query) {
    const returnList = []
    this.allCocktails.forEach(cocktail => {
      // make cocktail name & query lowercase for comparing
      const name = cocktail.name.toLowerCase()
      // eslint-disable-next-line no-param-reassign
      query = query.toLowerCase()
      if (name.startsWith(query)) {
        returnList.push(cocktail)
      }
    })
    this.updateDisplayList(returnList)
  }

  filterCocktailsByBannedIngredient (bannedIngredients) {
    const data = this.checkIngredientBanList(bannedIngredients)
    const returnList = []
    this.displayList.forEach(cocktail => {
      if (data.bannedIds.indexOf(cocktail.id) === -1) {
        returnList.push(cocktail)
      }
    })
    data.subIds.forEach(id => this.markedIDs.push(id))
    this.updateDisplayList(returnList)
  }

  // Zum Reste verwerten: nur cocktails mit ausschließlich den gewünschten Zutaten werden angezeigt
  getCocktailsFromIngredients (ingredients, withDeco) {
    if (ingredients.length === 0) {
      this.updateDisplayList(this.allCocktails)
      return
    }

    const returnList = []
    this.markedIDs = []
    this.substitutedIngredients = []

    this.allCocktails.forEach(cocktail => {
      const data = cocktail.checkIfCocktailHasOnlyTheseIngredients(ingredients, withDeco, this.substitutes)
      if (data.bool) {
        returnList.push(cocktail)
      } else if (data.bool === undefined) {
        returnList.push(cocktail)
        this.markedIDs.push(cocktail.id)

        data.substitutedIngredients.forEach(sub => {
          this.substitutedIngredients.push(sub)
        })
      }
    })
    this.updateDisplayList(returnList)
  }

  // Alle Cocktails die mindestens alle angegebenen Zutaten benötigen
  getCocktailsWithIngredients (ingredients, withDeco) {
    this.markedIDs = []
    this.substitutedIngredients = []
    const returnList = []
    this.allCocktails.forEach(cocktail => {
      const data = cocktail.checkIfCocktailHasIngredients(ingredients, withDeco, this.substitutes)
      if (data.bool) {
        returnList.push(cocktail)
      } else if (data.bool === undefined) {
        returnList.push(cocktail)
        this.markedIDs.push(cocktail.id)

        data.substitutedIngredients.forEach(sub => {
          this.substitutedIngredients.push(sub)
        })
      }
    })
    this.updateDisplayList(returnList)
  }

  checkIngredientBanList (bannedIngredients) {
    const bannedIds = []
    let subIds = []

    this.allCocktails.forEach(cocktail => {
      const ingredients = []
      cocktail.recipe.mainIngredients.forEach(component => {
        ingredients.push(component.ingredient.displayName)
      })
      cocktail.recipe.decoIngredients.forEach(component => {
        ingredients.push(component.ingredient.displayName)
      })

      bannedIngredients.forEach(bannedIngredient => {
        if (ingredients.indexOf(bannedIngredient) !== -1) {
          let canBeSubstituted = false

          // wenn ein Ersatz für die gesperrte Zutat möglich ist, soll der Cocktail markiert angezeigt werden
          this.substitutes[bannedIngredient].forEach(sub => {
            // wenn die bannedIngredient durch eine nicht gebannte Zutat ersetzt werden kann
            if (bannedIngredients.indexOf(sub) === -1) {
              canBeSubstituted = true
              this.substitutedIngredients.push(bannedIngredient)
            }
          })

          if (canBeSubstituted) {
            subIds.push(cocktail.id)
          } else {
            bannedIds.push(cocktail.id)
            subIds = subIds.filter(item => item !== cocktail.id)
          }
        }
      })
    })
    return { subIds, bannedIds }
  }

  getRecipeFromData (data) {
    const recipe = new Recipe()
    Object.entries(data.main_ingredients).forEach((entry) => {
      const [key, value] = entry
      const ingredient = this.getIngredientFromKey(key)
      recipe.addMainIngredient(ingredient, value[0], value[1])
    })
    Object.entries(data.deko_ingredients).forEach((entry) => {
      const [key, value] = entry
      const ingredient = this.getIngredientFromKey(key)
      recipe.addMainIngredient(ingredient, value[0], value[1])
    })
    return recipe
  }

  getIngredientFromKey (key) {
    const alcoholic = this.allIngredients.isIngredientAlcoholic(key)
    const displayName = this.allIngredients.getDisplayNameFromName(key)
    return new Ingredient(key, displayName, alcoholic)
  }
}

export { CocktailListManager }
