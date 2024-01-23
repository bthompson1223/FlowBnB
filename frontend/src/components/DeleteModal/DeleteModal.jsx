import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useState } from "react";
import { deleteCurrentSpot } from "../../store/spots";

function DeleteModal({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [spotExists, setSpotExists] = useState(true);

  const delSpotModal = (e) => {
    e.preventDefault();
    dispatch(deleteCurrentSpot(spot.id));
    closeModal();
    setSpotExists(false);
  };

  const cancelDel = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div>
      {spotExists && (
        <div className="deleteContainer">
          <h2 className="confirm">Confirm Delete</h2>
          <p className="confirmation">
            Are you sure you want to remove this spot from the listings?
          </p>
          <button className="delete" onClick={delSpotModal}>
            Yes (Delete Spot)
          </button>
          <button className="dontDelete" onClick={cancelDel}>
            No (Keep Spot)
          </button>
        </div>
      )}
    </div>
  );
}

export default DeleteModal;
