import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/getAllSpots";

const GET_SPOT_DETAILS = "spots/getSpotDetails";

const UPDATE_SPOT = "spots/updateSpot";

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

const updateSpot = (payload) => {
  return {
    type: UPDATE_SPOT,
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

export const spotUpdate = (updatedDetails, spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      body: JSON.stringify(updatedDetails),
    });

    const updatedSpot = await res.json();
    dispatch(updateSpot(updatedSpot));
    return updatedSpot;
  } catch (errs) {
    return errs;
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
  const spotsPostCreation = { ...state.allSpots.Spots };
  switch (action.type) {
    case GET_ALL_SPOTS:
      return { ...state, allSpots: action.payload };
    case GET_SPOT_DETAILS:
      return { ...state, currSpot: action.payload };

    case UPDATE_SPOT:
      spotsPostCreation[action.payload] = action.payload;
      return {
        ...state,
        allSpots: spotsPostCreation,
        currSpot: action.payload,
      };
    case DELETE_SPOT:
      delete spotsPostCreation[action.payload];
      return { ...state, allSpots: spotsPostCreation };
    default:
      return state;
  }
};

export default spotsReducer;
