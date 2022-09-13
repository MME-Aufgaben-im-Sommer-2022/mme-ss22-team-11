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
            if (ingredients.indexOf(component.ingredient.displayName) == -1) {
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

}

export { Cocktail };