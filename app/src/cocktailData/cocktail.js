class Cocktail {

  constructor(id, name, recipe, image, ratings, tags, description, steps,
    author) {
    this.id = id;
    this.name = name;
    this.recipe = recipe;
    this.image = image;

    if (ratings === undefined) {
      this.ratings = [];
    } else {
      this.ratings = ratings;
    }
    this.tags = tags;

    if (description === undefined) {
      this.description = "";
    } else {
      this.description = description;
    }

    this.steps = steps;
    this.author = author;
    this.isAlcoholic = this.getIsAlcoholic();

  }

  toDBObject() {

    //console.log(this.ratings, this.description);

    let data = {};

    data.name = this.name;

    data.recipe = JSON.stringify(this.recipe);
    data.ratings = JSON.stringify(this.ratings);
    data.description = this.description;
    data.tags = this.tags;
    data.author = this.author;
    data.image = this.image;
    data.id = this.id;

    data.steps = [];
    for (let val of Object.values(this.steps)) {
      data.steps.push(val);
    }

    return data;
  }

  addRating(rating) {
    this.ratings.push(rating);
  }

  deleteRating(email) {
    let newRatings = [];
    this.ratings.forEach(rating => {
      if (rating.email !== email) {
        newRatings.push(rating);
      }
      this.ratings = newRatings;
    });
  }

  getRating() {
    if (this.ratings.length === 0) {
      return undefined;
    }

    let sum = 0;
    this.ratings.forEach(rating => sum += rating.stars);
    return sum / this.ratings.length;

  }

  getIsAlcoholic() {

    let alcoholic = false;

    this.recipe.mainIngredients.forEach(component => {
      if (component.ingredient.alcoholic) {
        alcoholic = true;
      }
    });

    this.recipe.decoIngredients.forEach(component => {
      if (component.ingredient.alcoholic) {
        alcoholic = true;
      }
    });

    return alcoholic;
  }

  // Reste verwerten:
  checkIfCocktailHasOnlyTheseIngredients(ingredients, withDeco, subs) {

    // Eiswürfel ignorieren? (vielleicht mit checkbox)
    let bool = true,
      substitutedIngredients = [],
      ings = [],
      data;
    ingredients.forEach(ingredient => {
      ings.push(ingredient.ingredient);
    });

    this.recipe.mainIngredients.forEach(component => {

      if (ings.indexOf(component.ingredient.displayName) === -1 && component.ingredient.displayName !== "Eiswürfel" && component.ingredient.displayName !== "Crushed Ice") {

        let ingredientSubs = subs[component.ingredient.displayName],
          foundSub = false;

        if (ingredientSubs !== undefined) {
          ingredientSubs.forEach(sub => {
            if (ings.indexOf(sub) !== -1) {
              foundSub = true;
              substitutedIngredients.push(component.ingredient.displayName);
            }
          });
        }

        // undefined, wenn die Zutat durch eine Vorhandene Zutat ersetzt werden kann
        if ((foundSub && bool) || (foundSub && bool === undefined)) {
          bool = undefined;
        } else {
          bool = false;
        }
      }

    });

    if (withDeco) {
      this.recipe.decoIngredients.forEach(component => {
        if (ingredients.indexOf(component.ingredient.displayName) === -1) {
          bool = false;
        }
      });
    }

    data = {};
    data.bool = bool;
    data.substitutedIngredients = substitutedIngredients;
    return data;

  }

  // Hat der Cocktail mindestens die angegebenen Zutaten?
  checkIfCocktailHasIngredients(ingredients, withDeco, subs) {

    let bool = true,
      lst = [],
      substitutedIngredients = [],
      ings = [],
      data = {};

    this.recipe.mainIngredients.forEach(component => {
      lst.push(component.ingredient.displayName);
    });

    if (withDeco) {
      this.recipe.decoIngredients.forEach(component => {
        lst.push(component.ingredient.displayName);
      });
    }

    ingredients.forEach(ingredient => {
      ings.push(ingredient.ingredient);
    });

    ings.forEach(ingredient => {
      if (lst.indexOf(ingredient) === -1) {

        let ingredientSubs = subs[ingredient],
          foundSub = false;

        ingredientSubs.forEach(sub => {

          if (lst.indexOf(sub) !== -1) {
            foundSub = true;
            substitutedIngredients.push(ingredient);
          }
        });

        // undefined, wenn die Zutat durch eine Vorhandene Zutat ersetzt werden kann
        if ((foundSub && bool) || (foundSub && bool === undefined)) {
          bool = undefined;
        } else {
          bool = false;
        }
      }
    });

    data.bool = bool;
    data.substitutedIngredients = substitutedIngredients;
    return data;

  }

  addComment(comment) {
    this.comments.push(comment);
  }

  getAllDisplayNames() {
    let displayNames = [];

    this.recipe.mainIngredients.forEach(component => {
      // wenn gleicher displayname öfter im rezept ist
      if (displayNames.indexOf(component.ingredient.displayName) === -1) {
        displayNames.push(component.ingredient.displayName);
      }
    });

    return displayNames;

  }

}

export { Cocktail };