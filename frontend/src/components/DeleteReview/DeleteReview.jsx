import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useEffect } from "react";
import { deleteExistingReview, fetchReviews } from "../../store/reviews";
import { fetchSpotDetails } from "../../store/spots";
import "./DeleteReview.css";

function DeleteReview({ spot, review }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  useEffect(() => {
    dispatch(fetchReviews(spot.id));
  }, [dispatch, spot]);

  const deleteReview = () => {
    dispatch(deleteExistingReview(review.id));

    dispatch(fetchSpotDetails(spot.id));
    closeModal();
  };

  const cancelDelete = () => {
    closeModal();
  };

  if (!review) return null;

  return (
    <div className="delete-rev-modal">
      <h2 className="confirmation-header">Confirm Deletion</h2>
      <p>Are you sure you want to delete this review?</p>
      <button className="delete-rev" onClick={deleteReview}>
        Yes (Delete Review)
      </button>
      <button className="cancel-del" onClick={cancelDelete}>
        No (Keep Review)
      </button>
    </div>
  );
}

export default DeleteReview;
