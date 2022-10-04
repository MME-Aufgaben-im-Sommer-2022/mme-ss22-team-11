import { Observable, Event } from "../../utils/Observable.js";

const PROFILE_REVIEW_TEMPLATE = document.getElementById("review-template")
  .innerHTML.trim();

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
    this.cocktailID = data.cocktailID;
    this.review = data.rating;
    this.el = createProfileReviewElement();
    this.el.addEventListener("click", (event) =>
      this.notifyAll(new Event(
        "RATING CLICKED", this.openReview(this.cocktailID))));
  }

  openReview(cocktailId) {
    /*
    let cocktailView = new CocktailView();
    cocktailView.fillHtml();
    cocktailView.showCocktailPage();
    */
  }

  fillHtml() {
    this.el.querySelector("");
  }

  appendTo(parent) {
    parent.append(this.el);
  }

  remove() {
    this.el.remove();
  }
}