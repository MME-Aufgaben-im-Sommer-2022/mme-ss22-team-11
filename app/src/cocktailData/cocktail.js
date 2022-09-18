class Cocktail {

    constructor(id, name, recipe, image, rating, numRatings, comments, category, tags, description, steps, author) {
        this.id = id;
        this.name = name;
        this.recipe = recipe;
        this.image = image;
        this.rating = rating;
        this.comments = comments;
        this.category = category;
        this.tags = tags;
        this.description = description;
        this.steps = steps;
        this.author = author;
        this.isAlcoholic = this.getIsAlcoholic();
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

    // nur displaynames werden berücksichtigt
    checkIfCocktailHasOnlyTheseIngredients(ingredients, withDeco) {

        //TODO: Eiswürfel ignorieren? (vielleicht mit checkbox)
        let bool = true;

        this.recipe.mainIngredients.forEach(component => {

            if (ingredients.indexOf(component.ingredient.displayName) == -1 && component.ingredient.displayName != "Eiswürfel" && component.ingredient.displayName != "Crushed Ice") {
                bool = false;
            }
        })

        if (withDeco) {
            this.recipe.decoIngredients.forEach(component => {
                if (ingredients.indexOf(component.ingredient.displayName) == -1) {
                    bool = false;
                }
            })
        }

        return bool;

    }

    // Hat der Cocktail mindestens die angegebenen Zutaten?
    checkIfCocktailHasIngredients(ingredients, withDeco) {

        let bool = true;
        let lst = [];

        this.recipe.mainIngredients.forEach(component => {
            lst.push(component.ingredient.displayName);
        });

        if (withDeco) {
            this.recipe.decoIngredients.forEach(component => {
                lst.push(component.ingredient.displayName);
            });
        }

        ingredients.forEach(ingredient => {
            if (lst.indexOf(ingredient.ingredient) == -1) {
                bool = false;
            }
        })

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
        })

        return displayNames;

    }

}

export { Cocktail };