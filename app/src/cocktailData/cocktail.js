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
    checkIfCocktailHasIngredients(ingredients, withDeco) {

        //TODO: Eiswürfel ignorieren? (vielleicht mit checkbox)
        let bool = true;

        this.recipe.mainIngredients.forEach(component => {
            if (component.ingredient.displayName.indexOf(ingredients) == -1 && component.ingredient.displayName != "Eiswürfel") {
                bool = false;
            }
        })

        if (withDeco) {
            this.recipe.decoIngredients.forEach(component => {
                if (component.ingredient.displayName.indexOf(ingredients) == -1) {
                    bool = false;
                }
            })
        }

        return bool;

    }

    addComment(comment) {
        this.comments.push(comment);
    }

}

export { Cocktail };