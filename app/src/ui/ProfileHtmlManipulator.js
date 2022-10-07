import { Observable, Event } from "../utils/Observable.js";

const SETTINGS_NAV_LINKS = document.querySelectorAll("#settings-nav .nav-link"),
    SETTINGS_FRAME = document.querySelector(".settings-frame"),
    BANNED_INGREDIENTS_SECTION_TEMPLATE = document.querySelector("#banned-ingredients-section-template").innerHTML.trim(),
    COCKTAIL_LIST_SECTION_TEMPLATE = document.querySelector("#cocktail-list-section-template").innerHTML.trim(),
    REVIEWS_SECTION_TEMPLATE = document.querySelector("#reviews-section-template").innerHTML.trim();

SETTINGS_FRAME.append(getViewFromTemplate(COCKTAIL_LIST_SECTION_TEMPLATE));

function getViewFromTemplate(template) {
    let el = document.createElement("div");
    el.innerHTML = template;
    return el.firstChild;
}

class HtmlManipulator extends Observable {

    constructor() {

        super();

        for (let item of SETTINGS_NAV_LINKS) {
            item.addEventListener("click", (event) => {
                this.notifyAll(new Event("CHANGE_PROFILE_CONTENT", item.id));
/*
                if(item.id == "favorites") {
                    SETTINGS_FRAME.innerHTML = "";

                    SETTINGS_FRAME.append(getViewFromTemplate(COCKTAIL_LIST_SECTION_TEMPLATE));
                    SETTINGS_FRAME.firstChild.querySelector("h1").textContent = "Favoriten";
                }
                else if(item.id == "created-cocktails") {
                    SETTINGS_FRAME.innerHTML = "";

                    SETTINGS_FRAME.append(getViewFromTemplate(COCKTAIL_LIST_SECTION_TEMPLATE));
                    SETTINGS_FRAME.firstChild.querySelector("h1").textContent = "Erstellte Cocktails";
                }
                else if(item.id == "reviews") {
                    SETTINGS_FRAME.innerHTML = "";

                    SETTINGS_FRAME.append(getViewFromTemplate(REVIEWS_SECTION_TEMPLATE));
                }
        */
                for (let item of SETTINGS_NAV_LINKS) {
                    if (item.classList.contains("active")) {
                        item.classList.remove("active");
                    }
                }
                item.classList.add("active");
            });
        }
    }

}

export { HtmlManipulator };