import { useEffect } from "react";
import { fetchAllSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

function LandingPage() {
  const dispatch = useDispatch();

  let spots = useSelector((state) => state.spots);
  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  const spotsContainer =
    spots.allSpots.Spots &&
    spots?.allSpots?.Spots.map((spot) => (
      <div key={spot.id} className="spotContainer">
        <NavLink to={`/spots/${spot.id}`}>
          <div className="imgContainer">
            <div className="toolTip" title={spot.name}>
              <img src={spot.previewImage} className="prevImg" />
            </div>
          </div>
          <div className="location-price">
            <p className="location">
              {spot.city}, {spot.state}
            </p>
            <p className="price">${spot.price} night</p>
          </div>
          <div className="reviewSection">
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

  return <div>{spotsContainer}</div>;
}

export default LandingPage;
