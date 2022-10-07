import { Observable, Event } from "../../utils/Observable.js";
import { CocktailView } from "../cocktail/CocktailView.js";

const PROFILE_REVIEW_TEMPLATE = document.getElementById("review-template")
  .innerHTML.trim();

const PROFILE_REVIEWS_CONTAINER = document.querySelector(".reviews-container"),
  MAX_STARS = 5;

function createProfileReviewElement() {
  let el = document.createElement("div");
  el.innerHTML = PROFILE_REVIEW_TEMPLATE;
  return el.querySelector(".review");
}

// let id = "cocktailNr" + cocktail.id,
// data = cocktail.toDBObject();
class ProfileReviewView extends Observable {

  constructor(data) {
    super();
    this.data = data;
    this.el = createProfileReviewElement();

    this.el.querySelector(".review-header a").addEventListener("click", (event) =>
      this.notifyAll(new Event(
        "RATING CLICKED", this.openReviewedCocktail())));
  }

  openReviewedCocktail() {
    let cocktailView = new CocktailView(this.data.cocktail);
    cocktailView.fillHtml();
    cocktailView.showCocktailPage();
  }

  fillHtml() {
    this.el.querySelector(".review-header a").textContent = this.data.cocktailName;
    this.el.querySelector(".review-text").textContent = this.data.review;

    let rating = this.cocktail.getRating();

    for (let i = 0; i < MAX_STARS; i++) {
      let star = document.createElement("img");
      star.setAttribute("draggable", "false");
      if (i < rating) {
        star.src = "./resources/css/img/VectorStarFilledBlack.svg";
      } else {
        star.src = "./resources/css/img/VectorStarHollowBlack.svg";
      }
      this.el.querySelector(".rating").innerHTML = "";
      this.el.querySelector(".rating").append(star);
    };
  }

  appendView() {
    PROFILE_REVIEWS_CONTAINER.append(this.el);
  }

  remove() {
    this.el.remove();
  }
}

export { ProfileReviewView };