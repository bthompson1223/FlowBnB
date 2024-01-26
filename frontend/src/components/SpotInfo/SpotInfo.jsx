import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spots";
import Reviews from "../Reviews/Reviews";
import "./SpotInfo.css";

function SpotInfo() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.currSpot);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);
  if (!spot) return null;
  if (!spot.SpotImages) return null;
  if (spot.id !== parseInt(spotId)) return null;
  const showAlert = () => {
    alert("Feature Coming Soon");
  };

  if (spot?.price) {
    spot.price = parseFloat(spot.price).toFixed(2);
  }

  return (
    <div id="spot-info-display">
      <h1 className="spot-name">{spot.name}</h1>
      <div className="location">
        {spot.city}, {spot.state}, {spot.country}
      </div>
      <div className="imgs">
        <div className="main-img-sec">
          {" "}
          <img src={spot.SpotImages[0].url} className="main-img" />{" "}
        </div>
        <div className="extras">
          <div className="other-imgs">
            {spot.SpotImages[1] && (
              <img
                src={spot.SpotImages[1].url}
                className="extra1 additional-img"
              />
            )}
            {spot.SpotImages[2] && (
              <img
                src={spot.SpotImages[2].url}
                className="extra2 additional-img"
              />
            )}
          </div>
          <div className="other-imgs2">
            {spot.SpotImages[3] && (
              <img
                src={spot.SpotImages[3].url}
                className="extra3 additional-img"
              />
            )}
            {spot.SpotImages[4] && (
              <img
                src={spot.SpotImages[4].url}
                className="extra4 additional-img"
              />
            )}
          </div>
        </div>
      </div>
      <div className="desc-res">
        <div className="text-button">
          <div className="details">
            <h2 className="ownerName">
              Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
            </h2>
            <p className="description">{spot.description}</p>
          </div>
          <div className="reserve">
            <div className="not-button">
              <div className="res-info">
                <div className="priceRevs"> ${spot.price} night </div>
              </div>
            </div>
            <button className="res-button" onClick={showAlert}>
              Reserve
            </button>
          </div>
        </div>
      </div>
      <Reviews spotId={spotId} />
    </div>
  );
}

export default SpotInfo;
