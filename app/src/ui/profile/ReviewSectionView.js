import { Observable, Event } from "../../utils/Observable.js";
import { ProfileReviewView } from "./ProfileReviewView.js"

const PROFILE_REVIEW_SECTION_TEMPLATE = document.getElementById("reviews-section-template")
  .innerHTML.trim();

const SETTINGS_FRAME = document.querySelector(".settings-frame"),
    reviewList = [];

function createProfileReviewSection () {
    let el = document.createElement("div");
    el.innerHTML = PROFILE_REVIEW_SECTION_TEMPLATE;
    return el.querySelector(".reviews-section");
}

class ReviewSectionView extends Observable {

    constructor() {
        super();
        this.el = createProfileReviewSection();

        SETTINGS_FRAME.querySelectorAll(".review-delete").forEach(el => {
            el.addEventListener("mouseover", (event) => {
                el.src = "./resources/css/img/VectorTrashCanHover.svg";
            });
            el.addEventListener("mouseout", (event) => {
                el.src = "./resources/css/img/VectorTrashCan.svg";
            });
            el.addEventListener("click", (event) => {
                console.log("delete review");
            });
        });
    }

    showReviewSection() {
        SETTINGS_FRAME.innerHTML = "";
        SETTINGS_FRAME.append(this.el);
    }

    addReview(data) {
        let reviewView = new ProfileReviewView(data);
        reviewView.appendView();
        reviewList.push(reviewView);
    }

    addAllReviews(data) {
        reviews.forEach(review => this.addReview(data));
    }

    removeAllReviews() {
        reviewList.forEach((view) => view.remove())
    }

    refreshReviews(reviews) {
        this.removeAllReviews();
        this.addAllReviews(reviews);
    }

}

export { ReviewSectionView };