class Ingredient {

    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.replacements = [];
    }

    setReplacements(replacements) {
        this.replacements = replacements;
    }

}

export { Ingredient };