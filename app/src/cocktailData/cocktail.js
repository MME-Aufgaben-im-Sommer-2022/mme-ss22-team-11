class Cocktail {

    constructor(id, name, recipe, image, rating, comments, category, tags, description, steps, author) {
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
        this.recipe.mainIngredients.forEach(component => {
            if (component.ingredient.alcoholic) {
                return true;
            }
        });

        this.recipe.decoIngredients.forEach(component => {
            if (component.ingredient.alcoholic) {
                return true;
            }
        });

        return false;
    }

    // nur displaynames werden berücksichtigt
    checkIfCocktailHasIngredients(ingredients, withDeco) {

        //TODO: Eiswürfel ignorieren? (vielleicht mit checkbox)

        this.recipe.mainIngredients.forEach(component => {
            if (ingredients.indexOf(component.ingredient.displayName) == -1) {
                return false;
            }
        })

        if (withDeco) {
            this.recipe.decoIngredients.forEach(component => {
                if (ingredients.indexOf(component.ingredient.displayName) == -1) {
                    return false;
                }
            })
        }

        return true;

    }

}

export { Cocktail };