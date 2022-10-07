import Observable from "../utils/Observable.js";

class ReviewManager extends Observable {

    constructor() {
        super();
    }

    isRatingValid(rating) {
        // console.log(rating);
        // eslint-disable-next-line no-magic-numbers
        if (rating > 0 && rating <= 5) {
            return true;
        }
        alert("Invalid Rating");
        return false;
    }
}

export { ReviewManager };