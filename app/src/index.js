let NAV_LINKS = document.getElementsByClassName("nav-link")


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