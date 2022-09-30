import { HtmlManipulator } from "./ui/RecipeHtmlManipulator.js";
import { CocktailCreator } from "./cocktailData/cocktailCreator.js";

let htmlManipulator = new HtmlManipulator(),
    cocktailCreator = new CocktailCreator(),
    cocktailSubmit = document.querySelector(".creator-upload-button");
console.log(cocktailSubmit);

// TODO: listener for button input
cocktailSubmit.addEventListener("click", () => {
    cocktailCreator.processUserInput();
});

