import { useEffect } from "react";
import { fetchAllSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const dispatch = useDispatch();

  let spots = useSelector((state) => state.spots);
  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  if (spots)
    spots.allSpots?.Spots?.forEach((spot) => {
      if (spot?.price) {
        spot.price = parseFloat(spot.price).toFixed(2);
      }
    });

  const spotsContainer =
    spots.allSpots.Spots &&
    spots?.allSpots?.Spots.map((spot) => (
      <div key={spot.id} className="spot-container">
        <NavLink to={`/spots/${spot.id}`}>
          <div>
            <div className="toolTip" title={spot.name}>
              <img src={spot.previewImage} className="prev-img" />
            </div>
          </div>
          <div className="location-price">
            <p className="location">
              {spot.city}, {spot.state}
            </p>
            <p className="price">${spot.price} night</p>
          </div>
          <div className="review-section">
            <div className="reviews">
              <i className="fa-solid fa-star"></i>
              {typeof spot.avgRating === "number" ? (
                <p>{parseFloat(spot.avgRating).toFixed(1)}</p>
              ) : (
                <p>New</p>
              )}
            </div>
          </div>
        </NavLink>
      </div>
    ));

  return (
    <div className="page-return">
      <div className="home">{spotsContainer}</div>
    </div>
  );
}

export default LandingPage;
