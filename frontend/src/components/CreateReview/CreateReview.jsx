import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createNewReview, fetchReviews } from "../../store/reviews";
import * as sessionActions from "../../store/reviews";
import "./CreateReview.css";

function CreateReview({ spot, user }) {
  const dispatch = useDispatch();
  const spotId = useSelector((state) => state.spots.currSpot.id);

  const [reviewText, setReviewText] = useState("");
  const [stars, setStars] = useState("");
  const [errs, setErrs] = useState({});

  const { closeModal } = useModal();

  const setRating = (e) => {
    e.preventDefault();
    setStars(e.target.id);
  };

  const validateSubmit = () => {
    if (reviewText.length > 250)
      setErrs({ review: "Review must be less than 250 characters" });
    else setErrs({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!errs.review) {
      const newRev = {
        userId: user.id,
        spotId: spot.id,
        review: reviewText,
        stars,
      };
      const res = await dispatch(createNewReview(newRev, spotId));
      await dispatch(sessionActions.fetchReviews(spotId));
      await dispatch(fetchReviews(spotId));

      closeModal();
      setReviewText("");
      setStars(0);

      return res;
    }
  };

  // console.log("errs =>", errs);
  return (
    <div className="create-review-content">
      <h1 className="stay-header">How was your stay?</h1>
      {errs.review && (
        <div className="error">Review must be less than 250 characters.</div>
      )}
      <form onSubmit={handleSubmit} className="revModalForm">
        <textarea
          className="rev-text"
          type="text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Leave your review here..."
          required
        />
        <div className="star-box">
          <i
            id="1"
            className={stars > 0 ? "fa-solid fa-star" : "fa-regular fa-star"}
            onClick={setRating}
          ></i>
          <i
            id="2"
            className={stars > 1 ? "fa-solid fa-star" : "fa-regular fa-star"}
            onClick={setRating}
          ></i>
          <i
            id="3"
            className={stars > 2 ? "fa-solid fa-star" : "fa-regular fa-star"}
            onClick={setRating}
          ></i>
          <i
            id="4"
            className={stars > 3 ? "fa-solid fa-star" : "fa-regular fa-star"}
            onClick={setRating}
          ></i>
          <i
            id="5"
            className={stars > 4 ? "fa-solid fa-star" : "fa-regular fa-star"}
            onClick={setRating}
          ></i>
          <p className="star-label">Stars</p>
        </div>
        <button
          className="submit-rev-button"
          disabled={reviewText.length < 10 || stars < 1}
          onClick={validateSubmit}
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default CreateReview;
