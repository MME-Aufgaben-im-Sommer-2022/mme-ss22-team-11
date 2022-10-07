import { Observable, Event } from "../utils/Observable.js";

const SETTINGS_NAV_LINKS = document.querySelectorAll("#settings-nav .nav-link"),
    SETTINGS_FRAME = document.querySelector(".settings-frame"),
    BANNED_INGREDIENTS_SECTION_TEMPLATE = document.querySelector("#banned-ingredients-section-template").innerHTML.trim(),
    COCKTAIL_LIST_SECTION_TEMPLATE = document.querySelector("#cocktail-list-section-template").innerHTML.trim(),
    REVIEWS_SECTION_TEMPLATE = document.querySelector("#reviews-section-template").innerHTML.trim();


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