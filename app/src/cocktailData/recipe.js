class Component {

    constructor(ingredient, portion, unit) {
        this.ingredient = ingredient;
        this.portion = portion;
        this.unit = unit;
    }

}

class Recipe {

    constructor() {
        this.mainIngredients = [];
        this.decoIngredients = [];
    }

    addMainIngredient(ingredient, portion, unit) {
        this.mainIngredients.push(new Component(ingredient, portion, unit));
    }

    addDecoIngredient(ingredient, portion, unit) {
        this.decoIngredients.push(new Component(ingredient, portion, unit));
    }

}

export { Component, Recipe };