const SETTINGS_NAV_LINKS = document.querySelectorAll("#settings-nav .nav-link");
const SETTINGS_FRAME = document.querySelector(".settings-frame");

const BANNED_INGREDIENTS_SECTION_TEMPLATE = document.querySelector("#banned-ingredients-section-template").innerHTML.trim();
const COCKTAIL_LIST_SECTION_TEMPLATE = document.querySelector("#cocktail-list-section-template").innerHTML.trim();
const REVIEWS_SECTION_TEMPLATE = document.querySelector("#reviews-section-template").innerHTML.trim();

SETTINGS_FRAME.append(getViewFromTemplate(COCKTAIL_LIST_SECTION_TEMPLATE));


function getViewFromTemplate(template) {
    let el = document.createElement("div");
    el.innerHTML = template;
    return el.firstChild;
}

class HtmlManipulator {

    constructor() {
        for (let item of SETTINGS_NAV_LINKS) {
            item.addEventListener("click", (event) => {
                if(item.id == "favorites") {
                    SETTINGS_FRAME.innerHTML = "";

                    console.log("open favorites");
                    SETTINGS_FRAME.append(getViewFromTemplate(COCKTAIL_LIST_SECTION_TEMPLATE));
                    SETTINGS_FRAME.firstChild.querySelector("h1").textContent = "Favoriten";
                }
                else if(item.id == "banned-ingredients") {
                    SETTINGS_FRAME.innerHTML = "";
                    
                    console.log("open banned-ingredients");
                    SETTINGS_FRAME.append(getViewFromTemplate(BANNED_INGREDIENTS_SECTION_TEMPLATE));
                }
                else if(item.id == "created-cocktails") {
                    SETTINGS_FRAME.innerHTML = "";
                    
                    console.log("open created-cocktails");
                    SETTINGS_FRAME.append(getViewFromTemplate(COCKTAIL_LIST_SECTION_TEMPLATE));
                    SETTINGS_FRAME.firstChild.querySelector("h1").textContent = "Erstellte Cocktails";
                }
                else {
                    SETTINGS_FRAME.innerHTML = "";
                    
                    console.log("open reviews");
                    SETTINGS_FRAME.append(getViewFromTemplate(REVIEWS_SECTION_TEMPLATE));

                    SETTINGS_FRAME.querySelectorAll(".review-header a").forEach(el => {
                        el.addEventListener("click", (event) => {
                            console.log("open cocktail");
                        })
                    })

                    SETTINGS_FRAME.querySelectorAll(".review-delete").forEach(el => {
                        el.addEventListener("mouseover", (event) => {
                            el.src = "../css/img/VectorTrashCanHover.svg";
                        })
                        el.addEventListener("mouseout", (event) => {
                            el.src = "../css/img/VectorTrashCan.svg";
                        })
                        el.addEventListener("click", (event) => {
                            console.log("delete review");
                        })
                    })
                }
        
                for (let item of SETTINGS_NAV_LINKS) {
                    if (item.classList.contains("active")) {
                        item.classList.remove("active")
                    }
                }
                item.classList.add("active")
            })
        }
    }

}

export { HtmlManipulator };