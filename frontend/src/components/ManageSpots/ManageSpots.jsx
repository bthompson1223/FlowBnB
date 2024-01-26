import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import DeleteSpot from "../DeleteSpot/DeleteSpot";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "./ManageSpots.css";

function ManageSpots() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  if (!spots.allSpots.Spots) {
    dispatch(fetchAllSpots());

    return null;
  }

  if (!user) {
    return <h1>You must be logged in to do that!</h1>;
  }

  const usersSpots = spots?.allSpots.Spots.filter(
    (spot) => spot.ownerId === user.id
  );

  usersSpots.forEach((spot) => {
    if (spot?.price) {
      spot.price = parseFloat(spot.price).toFixed(2);
    }
  });

  const usersSpotsDisplay = usersSpots?.map((spot) => (
    <div key={spot?.id} className="spot-contain">
      <NavLink to={`/spots/${spot.id}`}>
        <div className="img-container">
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
      <div className="update-delete">
        <button className="update-spot">
          <NavLink to={`/spots/${spot.id}/edit`} className="update-nav-link">
            Update
          </NavLink>
        </button>
        <div className="delete-button">
          <OpenModalButton
            buttonText={"Delete"}
            modalComponent={<DeleteSpot spot={spot} />}
          />
        </div>
      </div>
    </div>
  ));
  return (
    <div className="main-manage-box">
      <div className="header-create">
        <h1 className="manage-header">Manage Spots</h1>
        <NavLink to="/spots/new" className="new-spot-manage">
          Create A Spot
        </NavLink>
      </div>
      <div className="return-page">
        <div className="manage">{usersSpotsDisplay}</div>
      </div>
    </div>
  );
}

export default ManageSpots;
