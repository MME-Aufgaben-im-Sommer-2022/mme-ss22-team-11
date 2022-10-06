class Cocktail {

  constructor(id, name, recipe, image, ratings, tags, description, steps,
    author) {
    this.id = id;
    this.name = name;
    this.recipe = recipe;
    this.image = image;
    this.ratings = ratings;
    this.tags = tags;

    if (description == undefined) {
      this.description = "";
    } else {
      this.description = description;
    }

    this.steps = steps;
    this.author = author;
    this.isAlcoholic = this.getIsAlcoholic();

  }

  toDBObject() {
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

  deleteRating(username) {
    let newRatings = [];
    this.ratings.forEach(rating => {
      if (rating.username != username) {
        newRatings.push(rating);
      }
      this.ratings = newRatings;
    });
  }

  getRating() {
    if (this.ratings.length == 0) {
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

    //TODO: Eiswürfel ignorieren? (vielleicht mit checkbox)
    let bool = true;

        let ings = [];
        ingredients.forEach(ingredient => {
            ings.push(ingredient.ingredient);
        });

        this.recipe.mainIngredients.forEach(component => {

            if (ings.indexOf(component.ingredient.displayName) == -1 && component.ingredient.displayName != "Eiswürfel" && component.ingredient.displayName != "Crushed Ice") {

                let ingredientSubs = subs[component.ingredient.displayName];
                let foundSub = false;


                ingredientSubs.forEach(sub => {
                    if (ings.indexOf(sub) != -1) {
                        foundSub = true;
                    }
                });

                // undefined, wenn die Zutat durch eine Vorhandene Zutat ersetzt werden kann
                if ((foundSub && bool) || (foundSub && bool == undefined)) {
                    bool = undefined;
                } else {
                    bool = false;
                }
            }

        });

    if (withDeco) {
      this.recipe.decoIngredients.forEach(component => {
        if (ingredients.indexOf(component.ingredient.displayName) == -1) {
          bool = false;
        }
      });
    }

    return bool;

  }


    // Hat der Cocktail mindestens die angegebenen Zutaten?
    checkIfCocktailHasIngredients(ingredients, withDeco, subs) {

    let bool = true,
      lst = [];

    this.recipe.mainIngredients.forEach(component => {
      lst.push(component.ingredient.displayName);
    });

    if (withDeco) {
      this.recipe.decoIngredients.forEach(component => {
        lst.push(component.ingredient.displayName);
      });
    }


        let ings = [];
        ingredients.forEach(ingredient => {
            ings.push(ingredient.ingredient);
        });

        ings.forEach(ingredient => {
            if (lst.indexOf(ingredient) == -1) {

                let ingredientSubs = subs[ingredient];

                let foundSub = false;

                ingredientSubs.forEach(sub => {

                    if (lst.indexOf(sub) != -1) {
                        foundSub = true;
                    }
                });

                // undefined, wenn die Zutat durch eine Vorhandene Zutat ersetzt werden kann
                if ((foundSub && bool) || (foundSub && bool == undefined)) {
                    bool = undefined;
                } else {
                    bool = false;
                }
            }
        });


    return bool;

  }

  addComment(comment) {
    this.comments.push(comment);
  }

  getAllDisplayNames() {
    let displayNames = [];

    this.recipe.mainIngredients.forEach(component => {
      // wenn gleicher displayname öfter im rezept ist
      if (displayNames.indexOf(component.ingredient.displayName) == -1) {
        displayNames.push(component.ingredient.displayName);
      }
    });

    return displayNames;

  }

}

export { Cocktail };