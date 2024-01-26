import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useState } from "react";
import { deleteCurrentSpot } from "../../store/spots";
import "./DeleteSpot.css";

function DeleteSpot({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [spotExists, setSpotExists] = useState(true);

  const delSpotModal = (e) => {
    e.preventDefault();
    dispatch(deleteCurrentSpot(spot.id));
    setSpotExists(false);
    closeModal();
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div>
      {spotExists && (
        <div className="delete-container">
          <h2 className="confirm">Confirm Delete</h2>
          <p className="confirmation">
            Are you sure you want to remove this spot from the listings?
          </p>
          <button className="delete" onClick={delSpotModal}>
            Yes (Delete Spot)
          </button>
          <button className="dont-delete" onClick={cancelDelete}>
            No (Keep Spot)
          </button>
        </div>
      )}
    </div>
  );
}

export default DeleteSpot;
