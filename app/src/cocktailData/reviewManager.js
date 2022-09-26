import Observable from "../utils/Observable.js";

class ReviewManager extends Observable {

    constructor() {
        super();
    }

    isRatingValid(rating) {
        console.log(rating)
        if (0 < rating && rating <= 5) {
            return true;
        }
        alert("Invalid Rating")
        return false;
    }
}

export { ReviewManager };