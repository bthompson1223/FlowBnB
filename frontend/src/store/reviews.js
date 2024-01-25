import { csrfFetch } from "./csrf";

const GET_SPOT_REVS = "reviews/getReviews";
const CREATE_REVIEW = "reviews/createReview";
const DELETE_REVIEW = "reviews/deleteReview";

const getReviews = (payload) => {
  return {
    type: GET_SPOT_REVS,
    payload,
  };
};

const createReview = (payload) => {
  return {
    type: CREATE_REVIEW,
    payload,
  };
};

const deleteReview = (payload) => {
  return {
    type: DELETE_REVIEW,
    payload,
  };
};

export const fetchReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "GET",
  });
  if (res.ok) {
    const reviews = await res.json();
    dispatch(getReviews(reviews));
    return reviews;
  } else {
    const errs = await res.json();
    return errs;
  }
};

export const createNewReview = (review, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });
  if (res.ok) {
    const newReview = await res.json();
    dispatch(createReview(review, spotId));
    return newReview;
  } else {
    const errs = res.json();
    return errs;
  }
};

export const deleteExistingReview = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  if (res.ok) {
    dispatch(deleteReview(reviewId));
  } else {
    const errs = await res.json();
    return errs;
  }
};

const initialState = {
  spot: {},
  user: {},
};

export const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOT_REVS:
      return { ...state, spot: action.payload };
    case CREATE_REVIEW:
      return { ...state, [action.payload.id]: action.review };
    case DELETE_REVIEW: {
      const reviews = [...state.spot.Reviews];
      delete reviews[action.spotId];
      const updatedReviews = state.spot.Reviews.filter(
        (review) => review.id !== action.payload
      );
      return { ...state, spot: { Reviews: updatedReviews } };
    }
    default:
      return state;
  }
};

export default reviewsReducer;
