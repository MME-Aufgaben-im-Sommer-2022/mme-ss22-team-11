import { HtmlManipulator } from "./ui/RecipeHtmlManipulator.js";
import { CocktailListManager } from "./cocktailData/cocktailListManager.js";
import { IngredientFilterManager } from "./cocktailData/ingredientFilterManager.js";
import { ReviewManager } from "./cocktailData/reviewManager.js"
import { ListView } from "./ui/ListView.js";
import { IngredientListView } from "./ui/ingredients/IngredientListView.js";
import { CocktailView } from "./ui/cocktail/CocktailView.js";
import { User } from "./profile/user.js";
import { Login } from "./profile/login.js";
import { CocktailCreator } from "./cocktailData/cocktailCreator.js";
import { LoginView } from "./ui/LoginView.js";

let htmlManipulator = new HtmlManipulator(),
    cocktailListManager = new CocktailListManager(),
    ingredientFilterManager = new IngredientFilterManager(),
    listView = new ListView(),
    loginView = new LoginView(),
    reviewManager = new ReviewManager(),
    ingredientListView = new IngredientListView(),
    cocktailCreator,
    showCocktails = () => {
        listView.refreshCocktails(cocktailListManager.displayList, cocktailListManager.markedIDs);
    },
    login = new Login(),
    user;


htmlManipulator.addEventListener("COCKTAILCREATOR", (event) => {

    if (user != undefined) {

        cocktailCreator = new CocktailCreator();
        cocktailCreator.addEventListener("COCKTAIL_DATA_FOR_USER", (event) => {
            user.createCocktail(event.data);
            console.log(event.data)
        });

    } else {
        loginView.initializeLoginView();
        loginView.showLoginView();
        loginView.addEventListener("USER_SUBMIT", (event) => {
            console.log(event.data);

            if (event.data[0] == undefined) {
                login.login(event.data[1], event.data[2]);
            }
            else {
                login.singUp(event.data[0], event.data[1], event.data[2]);
            }

            // TODO: work with user input here
            // if event.data[0] is undefined -> user wants to login
        })
    }
});

/*
    Functions for using the LoginView
*/


loginView.initializeLoginView();
loginView.showLoginView();
loginView.addEventListener("USER_SUBMIT", (event) => {
    console.log(event.data);

    if (event.data[0] == undefined) {
        login.login(event.data[1], event.data[2]);
    }
    else {
        login.singUp(event.data[0], event.data[1], event.data[2]);
    }

    // TODO: work with user input here
    // if event.data[0] is undefined -> user wants to login
})


//TODO: LOGIN (standarduser, der nix kann, sign/log-in)
// Login soll benutzt werden, um nutzer zu erstellen, abzurufen oder einen anonymen User zu erstellen

// 
login.addEventListener("LOGIN", (event) => {
    loginView.removeLoginView();
    user = event.data;
    user.addEventListener("USER_DATA_CHANGED", (event) => login.updateUser(event.data));
    user.addEventListener("RATING_READY", (event) => {
        cocktailListManager.rateCocktail(event.data);
    });

    user.addEventListener("COCKTAIL_CREATION_REQUESTED", (event) => {
        console.log(event);
        cocktailListManager.addCustomCocktail(event.data)
    });
    cocktailListManager.addEventListener("COCKTAIL_CREATION_DONE", (event) => {
        user.onCocktailCreated(event.data)
    });
    //user.deleteIngredientFromBlackList("Cachaca");
    //user.addIngredientToBlackList("Cachaca");
    console.log(user);

});



// testing:
// login.singUp("Gix", "georg_dechant@web.de", "IchBinEinPasswort");
// login.login("georg_dechant@web.de", "IchBinEinPasswort");

cocktailListManager.addEventListener("DATA_READY", (event) => showCocktails());
cocktailListManager.addEventListener("DATA_UPDATED", (event) => showCocktails());
cocktailListManager.addEventListener("READY_FOR_COCKTAILS", (event) => cocktailListManager.onReadyForCocktails());
// user.addEventListener("RATING_READY", (event) => cocktailListManager.rateCocktail(event.data));

// Rewrite URL
//window.history.pushState('Rezepte', 'Rezepte', '/Rezepte');

// Ingredient Filter
ingredientFilterManager.addEventListener("INGREDIENT_DATA_READY", (event) => showIngredients());
ingredientFilterManager.addEventListener("INGREDIENT_DATA_UPDATED", (event) => showIngredients());

ingredientListView.addEventListener("INGREDIENT_SELECTED", (event) => filterCocktails());
ingredientListView.addEventListener("INGREDIENT_UNSELECTED", (event) => filterCocktails());

let filterCocktails = () => {
    let selected = ingredientListView.getAllSelected();

    cocktailListManager.getCocktailsFromIngredients(selected, false);
    addIngredientFilter();
}

let showIngredients = () => {
    ingredientListView.refreshSearchResults(ingredientFilterManager.displayList);
}

let processReview = (event) => {
    if (reviewManager.isRatingValid(event.data['rating'])) {
        // save review+rating to db etc.
    }
}

listView.addEventListener("COCKTAIL CLICKED", (event) => {
    let cocktailView = new CocktailView(event.data);
    cocktailView.fillHtml();
    cocktailView.showCocktailPage();
    cocktailView.addEventListener("REVIEW SUBMITTED", (event) => processReview(event));
})


// input listeners
let timeout = null,
    responseDelay = 500;
// Listen for user input in Search Bar
// Also wait for user to finish input (.5s) to reduce amount of callbacks
let searchInput = document.querySelector('.search-bar-input');
searchInput.addEventListener('keyup', function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        cocktailListManager.searchCocktailByName(searchInput.value);
        addIngredientFilter();
    }, responseDelay);

});

// Listen for user input in Ingredient Filter Search Bar
// Also wait for user to finish input (.5s) to reduce amount of callbacks
let searchInputIngredient = document.querySelector('.ingredient-input');
searchInputIngredient.addEventListener('keyup', function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        ingredientFilterManager.searchIngredientByName(searchInputIngredient.value);
    }, responseDelay);

});

function addIngredientFilter() {
    if (user == undefined) {
        return;
    }
    if (user.username != undefined) {
        cocktailListManager.filterCocktailsByBannedIngredient(user.blackListedIngredients);
    }
}
