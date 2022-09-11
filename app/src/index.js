const NAV_LINKS = document.getElementsByClassName("nav-link")
const INGREDIENTS = document.getElementsByClassName("ingredient")
const FILTER_CANCEL = document.getElementById("cancel-filter")
const FILTER_SECTION = document.getElementById("filter")

for (let item of NAV_LINKS) {
    item.addEventListener("click", (event) => {
        for (let item of NAV_LINKS) {
            if (item.classList.contains("active")) {
                item.classList.remove("active")
            }
        }
        item.classList.add("active")
    })
}

for (let item of INGREDIENTS) {
    item.addEventListener("click", (event) => {
        if (item.classList.contains("active")) {
            item.classList.remove("active")
        } else {
            item.classList.add("active")
        }
    })
}

FILTER_CANCEL.addEventListener("click", (event) => {
    FILTER_SECTION.style.display = "none";
    FILTER_SECTION.style.width = "0";
})
