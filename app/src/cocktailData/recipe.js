class Component {

    constructor(ingredient, portion) {
        this.ingredient = ingredient;
        this.portion = portion;
    }

}

class Recipe {

    constructor() {
        this.components = []
    }

    addIngredient(ingredient, portion) {
        this.components.push(new Component(ingredient, portion))
    }

}

export { Component, Recipe };