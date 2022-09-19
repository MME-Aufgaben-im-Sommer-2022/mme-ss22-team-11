const SETTINGS_NAV_LINKS = document.getElementsByClassName("nav-link");
const SETTINGS_FRAME = document.querySelector(".settings-frame");

const BANNED_INGREDIENTS_SECTION_TEMPLATE = document.querySelector("#banned-ingredients-section-template").innerHTML.trim();

function getViewFromTemplate(template) {
    let el = document.createElement("div");
    el.innerHTML = template;
    return el.firstChild;
}


for (let item of SETTINGS_NAV_LINKS) {
    item.addEventListener("click", (event) => {
        if(item.id == "favorites") {
            console.log("open favorites");
        }
        else if(item.id == "banned-ingredients") {
            console.log("open banned-ingredients");
            SETTINGS_FRAME.append(getViewFromTemplate(BANNED_INGREDIENTS_SECTION_TEMPLATE));
        }
        else if(item.id == "created-cocktails") {
            console.log("open created-cocktails");
        }
        else {
            console.log("open reviews");
        }
    })
}