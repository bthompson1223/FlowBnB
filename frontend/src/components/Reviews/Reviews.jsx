import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, returnInitial } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateReviewModal from "../CreateReview/CreateReview";
import DeleteReview from "../DeleteReview/DeleteReview";

function Reviews({ spotId }) {
  const dispatch = useDispatch();

  const spot = useSelector((state) => state.spots.currSpot);
  const currReviews = useSelector((state) => state.reviews.spot.Reviews);
  const currUser = useSelector((state) => state.session.user);

  console.log("spot: ", spot);
  //   console.log("revs: ", currReviews);
  // console.log("user: ", currUser)

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    dispatch(fetchReviews(spotId));
    return () => dispatch(returnInitial());
  }, [dispatch, spotId]);

  if (!spot) return null;
  if (!currReviews || !currReviews.length) return null;
  // if (!currUser) return null

  const orderRevs = [...currReviews].sort(
    (review, nextReview) =>
      new Date(nextReview.createdAt) - new Date(review.createdAt)
  );

  let ownerCheck = false;
  if (spot && spot.Owner && currUser) {
    ownerCheck = spot.Owner.id === currUser.id;
  }

  let reviewsLabel = "Reviews";

  if (currReviews.length === 1) {
    reviewsLabel = "Review";
  }

  let notReviewedState = true;
  if (currReviews) {
    for (const currRev of currReviews) {
      if (currUser && currRev.User.id === currUser.id) {
        notReviewedState = false;
        break;
      }
    }
  }

  let loggedIn = false;
  if (currUser) loggedIn = true;

  if (!currReviews.length) {
    return (
      <div className="revBox">
        <div className="revHeader">
          <i className="fa-solid fa-star"></i>

          <p className="revsLabel">New</p>
        </div>
        {loggedIn && !ownerCheck && notReviewedState && (
          <div className="postARev">
            <OpenModalButton
              className="postReviewBS"
              buttonText="Post Your Review"
              modalComponent={<CreateReviewModal spot={spot} user={currUser} />}
            />
          </div>
        )}
        {!ownerCheck && loggedIn && notReviewedState && (
          <p className="firstRev">Be the first to post a review!</p>
        )}
      </div>
    );
  }

  return (
    <div className="revBox">
      <div className="revHeader">
        <i id="revDisplayStar" className="fa-solid fa-star"></i>
        <div className="avgRate">
          {currReviews.length && spot?.avgStarRating?.toFixed(1)}
        </div>
        <div>•</div>
        <div className="revNumDisp"> {spot.numReviews} </div>
        <div className="revLabelDisp"> {reviewsLabel}</div>
      </div>
      {loggedIn && !ownerCheck && notReviewedState && (
        <OpenModalButton
          className="postRevButton"
          buttonText="Post Your Review"
          modalComponent={<CreateReviewModal spot={spot} user={currUser} />}
        />
      )}
      <div className="reviewList">
        {orderRevs
          .map((review) => (
            <div key={review.id} className="singleRev">
              <div className="userDisplay">{review.User.firstName}</div>
              <div className="date">
                <div className="month">
                  {months[new Date(review.createdAt).getMonth()]}
                </div>
                <div className="year">{review.createdAt.slice(6, 10)}</div>
              </div>
              <div className="revText">{review.review}</div>
              {currUser && currUser.id === review.User.id ? (
                <div className="delRevButtonBox">
                  <OpenModalButton
                    className="delRevButton"
                    buttonText="Delete Review"
                    modalComponent={
                      <DeleteReview review={review} spot={spot} />
                    }
                  />
                </div>
              ) : null}
            </div>
          ))
          .reverse()}
      </div>
    </div>
  );
}

export default Reviews;
