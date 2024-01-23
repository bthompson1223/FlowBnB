import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/getAllSpots";

const GET_SPOT_DETAILS = "spots/getSpotDetails";

const DELETE_SPOT = "spots/deleteSpot";

const getAllSpots = (payload) => {
  return {
    type: GET_ALL_SPOTS,
    payload,
  };
};

const getSpotDetails = (payload) => {
  return {
    type: GET_SPOT_DETAILS,
    payload,
  };
};

const deleteSpot = (payload) => {
  return {
    type: DELETE_SPOT,
    payload,
  };
};

export const fetchAllSpots = () => async (dispatch) => {
  try {
    const res = await csrfFetch("/api/spots");
    const data = await res.json();
    dispatch(getAllSpots(data));
  } catch (e) {
    return e;
  }
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    const data = await res.json();
    dispatch(getSpotDetails(data));
    return data;
  } catch (e) {
    return e;
  }
};

export const deleteCurrentSpot = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    const data = await res.json();

    dispatch(deleteSpot(spotId));
    return data;
  } catch (e) {
    return e;
  }
};

const initialState = {
  allSpots: {},
  currSpot: {},
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS:
      return { ...state, allSpots: action.payload };
    case GET_SPOT_DETAILS:
      return { ...state, currSpot: action.payload };
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;
