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
    }

}

export { Cocktail };