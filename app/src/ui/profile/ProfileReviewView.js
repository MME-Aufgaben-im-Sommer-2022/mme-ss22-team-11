import { Observable, Event } from "../../utils/Observable.js";
import { CocktailView } from "../cocktail/CocktailView.js";

const PROFILE_REVIEW_TEMPLATE = document.getElementById("review-template")
  .innerHTML.trim();

const MAX_STARS = 5;

function createProfileReviewElement() {
  let el = document.createElement("div");
  el.innerHTML = PROFILE_REVIEW_TEMPLATE;
  return el.querySelector(".review");
}

// let id = "cocktailNr" + cocktail.id,
// data = cocktail.toDBObject();
class ProfileReviewView extends Observable {

  constructor(data, container) {
    super();
    this.data = data;
    console.log(this.data);
    this.el = createProfileReviewElement();
    this.deleteButton = this.el.querySelector(".review-delete");
    this.container = container;

    this.deleteButton.addEventListener("mouseover", (event) => {
      this.deleteButton.src = "./resources/css/img/VectorTrashCanHover.svg";
    });

    this.deleteButton.addEventListener("mouseout", (event) => {
      this.deleteButton.src = "./resources/css/img/VectorTrashCan.svg";
    });

    this.deleteButton.addEventListener("click", (event) => {
      this.notifyAll(new Event("RATING_DELETION", this.data));
      this.remove();
    });
  }

  fillHtml() {
    this.el.querySelector(".review-header h1").textContent = this.data.cocktail.name;
    this.el.querySelector(".review-text").textContent = this.data.rating.text;

    let rating = this.data.rating.stars;

    for (let i = 0; i < MAX_STARS; i++) {
      let star = document.createElement("img");
      star.setAttribute("draggable", "false");
      if (i < rating) {
        star.src = "./resources/css/img/VectorStarFilledBlack.svg";
      } else {
        star.src = "./resources/css/img/VectorStarHollowBlack.svg";
      }
      this.el.querySelector(".rating").append(star);
    };
  }

  appendView() {
    this.container.append(this.el);
  }

  remove() {
    this.el.remove();
  }
}

export { ProfileReviewView };