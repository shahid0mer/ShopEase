import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addReview,
  getReviewsForProduct,
  updateReview,
  deleteReview,
  resetReviewState,
  getAllReview,
} from "../Features/Reviews/reviewSlice.js";
import {
  StarIcon,
  HandThumbUpIcon as ThumbUpIcon,
  HandThumbDownIcon as ThumbDownIcon,
} from "@heroicons/react/24/solid";
import { toast } from "sonner";

const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>{" "}
  </div>
);

const ReviewComponent = ({ productId }) => {
  const dispatch = useDispatch();
  const {
    reviews = [],
    loading = false,
    error = null,
    success = false,
  } = useSelector((state) => state.reviews) || {};

  const { user: userInfo } = useSelector((state) => state.auth) || {};

  const [activeTab, setActiveTab] = useState("all");
  const [ratingFilter, setRatingFilter] = useState(0);

  const [newReview, setNewReview] = useState({ rating: 0, content: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewData, setEditReviewData] = useState({
    rating: 0,
    content: "",
  });

  useEffect(() => {
    if (productId) {
      if (userInfo) {
        dispatch(getReviewsForProduct(productId));
      } else {
        dispatch(getAllReview({ productId }));
      }
    }
  }, [dispatch, productId, userInfo]);

  useEffect(() => {
    if (success) {
      if (editingReviewId) {
        toast.success("Review updated successfully!");
        setEditingReviewId(null);
        setEditReviewData({ rating: 0, content: "" });
      } else {
        toast.success("Review operation completed successfully!");
        setNewReview({ rating: 0, content: "" });
        setShowReviewForm(false);
      }
      dispatch(resetReviewState());

      dispatch(getReviewsForProduct(productId));
    }

    if (error) {
      toast.error(`Error: ${error}`);
      dispatch(resetReviewState());
    }
  }, [success, error, dispatch, editingReviewId, productId]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percent };
  });

  const filteredReviews = reviews.filter((review) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "withMedia" && review.images?.length > 0) ||
      (activeTab === "verified" && review.verified);
    const matchesRating = ratingFilter === 0 || review.rating === ratingFilter;
    return matchesTab && matchesRating;
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!userInfo) {
      toast.info("Please log in to submit a review.");
      return;
    }
    if (newReview.rating > 0 && newReview.content.trim() !== "") {
      const reviewPayload = {
        product_id: productId,
        rating: newReview.rating,
        content: newReview.content,
      };
      dispatch(addReview(reviewPayload));
    } else {
      toast.error("Please provide a rating and content for your review.");
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setEditReviewData({ rating: review.rating, content: review.content });
    setShowReviewForm(false);
  };

  const handleUpdateReview = (e) => {
    e.preventDefault();
    console.log("handleUpdateReview called!");
    if (!userInfo) {
      toast.error("Please log in to update a review.");
      return;
    }
    if (!editingReviewId) {
      return;
    }

    if (editReviewData.rating > 0 && editReviewData.content.trim() !== "") {
      dispatch(
        updateReview({
          reviewId: editingReviewId,
          rating: editReviewData.rating,
          content: editReviewData.content,
        }),
        toast.success("Review Updated")
      );
    } else {
      toast.info("Please provide a rating and content for the update.");
    }
  };

  // Handler to cancel editing and hide the edit form
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditReviewData({ rating: 0, content: "" });
  };

  const handleDeleteClick = (reviewId) => {
    toast("Are you sure you want to delete this review?", {
      action: {
        label: "Delete",
        onClick: () => {
          dispatch(deleteReview({ reviewId }));
          toast.success("Review deleted");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {
          toast.info("Deletion cancelled");
        },
      },
      duration: 6000,
    });
  };

  const handleVote = (reviewId, isHelpful) => {
    // console.log(`Voting on review ${reviewId}, helpful: ${isHelpful}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans dark:bg-neutral-900 dark:text-neutral-100">
      {/* Loader always visible when loading */}
      {loading && <Loader />}

      <div
        className="bg-white rounded-lg shadow-md p-6 mb-8
                      dark:bg-neutral-800 dark:shadow-neutral-900/50"
      >
        {" "}
        <h2
          className="text-2xl font-bold mb-4 text-gray-800
                       dark:text-neutral-100"
        >
          {" "}
          Customer Reviews
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="text-center">
            <div
              className="text-5xl font-bold text-gray-900
                            dark:text-neutral-50"
            >
              {" "}
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-6 w-6 ${
                    star <= Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-neutral-600"
                  }`}
                />
              ))}
            </div>
            <p
              className="text-sm text-gray-500 mt-1
                          dark:text-neutral-400"
            >
              {" "}
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="flex-1 w-full">
            {ratingDistribution.map(({ star, count, percent }) => (
              <div key={star} className="flex items-center mb-2 gap-2">
                <div
                  className="w-12 text-sm font-medium text-gray-600
                                dark:text-neutral-300"
                >
                  {" "}
                  {star} star
                </div>
                <div
                  className="flex-1 mx-2 h-4 bg-gray-200 rounded-full
                                dark:bg-neutral-700"
                >
                  {" "}
                  <div
                    className="h-4 bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div
                  className="w-10 text-sm text-gray-500 text-right
                                dark:text-neutral-400"
                >
                  {" "}
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        {userInfo ? (
          <button
            onClick={() => {
              setShowReviewForm(!showReviewForm);
              setEditingReviewId(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-medium py-2 px-4 rounded-md
                       dark:bg-blue-700 dark:hover:bg-blue-600 dark:active:scale-95 dark:text-white"
            disabled={loading}
          >
            {showReviewForm ? "Cancel Add Review" : "Write a Review"}
          </button>
        ) : (
          <p className="text-gray-600 text-sm dark:text-neutral-400">
            {" "}
            Please log in to write a review.
          </p>
        )}
      </div>

      {/* Conditional rendering for ADD NEW REVIEW Form */}
      {showReviewForm && !editingReviewId && (
        <div
          className="bg-white rounded-lg shadow-md p-6 mb-8
                          dark:bg-neutral-800 dark:shadow-neutral-900/50"
        >
          {" "}
          <h3 className="text-xl font-bold mb-4 dark:text-neutral-100">
            Write Your Review
          </h3>{" "}
          {error && toast.error(error)}
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-2
                                  dark:text-neutral-300"
              >
                {" "}
                Your Rating
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-gray-300"
                  >
                    <StarIcon
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoverRating || newReview.rating)
                          ? "text-yellow-400"
                          : "text-gray-300 dark:text-neutral-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="newComment"
                className="block text-sm font-medium text-gray-700 mb-1
                                    dark:text-neutral-300"
              >
                Your Review
              </label>
              <textarea
                id="newComment"
                rows="4"
                value={newReview.content}
                onChange={(e) =>
                  setNewReview({ ...newReview, content: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                             dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder-neutral-400 dark:focus:ring-blue-400 dark:focus:border-blue-400" // Dark mode textarea
                placeholder="What did you like or dislike?"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400
                           dark:bg-blue-700 dark:hover:bg-blue-600 dark:active:scale-95 dark:text-white dark:disabled:bg-neutral-600 dark:focus:ring-blue-400 dark:focus:ring-offset-neutral-800" // Dark mode submit button
              disabled={
                loading || newReview.rating === 0 || !newReview.content.trim()
              }
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Conditional rendering for EDIT REVIEW Form */}
      {editingReviewId && (
        <div
          className="bg-white rounded-lg shadow-md p-6 mb-8
                        dark:bg-neutral-800 dark:shadow-neutral-900/50"
        >
          {" "}
          {/* Dark mode background & shadow */}
          <h3 className="text-xl font-bold mb-4 dark:text-neutral-100">
            Edit Your Review
          </h3>{" "}
          {/* Dark mode heading */}
          {error && toast.error(error)}
          <form onSubmit={handleUpdateReview}>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-2
                                dark:text-neutral-300"
              >
                {" "}
                {/* Dark mode label */}
                Your Rating
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() =>
                      setEditReviewData({ ...editReviewData, rating: star })
                    }
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-gray-300"
                  >
                    <StarIcon
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoverRating || editReviewData.rating)
                          ? "text-yellow-400"
                          : "text-gray-300 dark:text-neutral-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="editComment"
                className="block text-sm font-medium text-gray-700 mb-1
                                  dark:text-neutral-300"
              >
                Your Review
              </label>
              <textarea
                id="editComment"
                rows="4"
                value={editReviewData.content}
                onChange={(e) =>
                  setEditReviewData({
                    ...editReviewData,
                    content: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500
                           dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder-neutral-400 dark:focus:ring-blue-400 dark:focus:border-blue-400" // Dark mode textarea
                placeholder="Edit your review"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 active:scale-95 transition-all text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400
                           dark:bg-green-700 dark:hover:bg-green-600 dark:active:scale-95 dark:text-white dark:disabled:bg-neutral-600 dark:focus:ring-green-400 dark:focus:ring-offset-neutral-800" // Dark mode update button
                disabled={
                  loading ||
                  editReviewData.rating === 0 ||
                  !editReviewData.content.trim()
                }
              >
                {loading ? "Updating..." : "Update Review"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex-none bg-gray-500 hover:bg-gray-600 active:scale-95 transition-all text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                           dark:bg-neutral-600 dark:hover:bg-neutral-500 dark:active:scale-95 dark:text-white dark:focus:ring-neutral-400 dark:focus:ring-offset-neutral-800" // Dark mode cancel button
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List & Filters */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-lg shadow-sm p-6
                                            dark:bg-neutral-800 dark:shadow-neutral-900/30"
            >
              {" "}
              {/* Dark mode individual review card */}
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 ${
                      star <= review.rating
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-neutral-600"
                    }`}
                  />
                ))}
              </div>
              <p
                className="text-gray-600 text-sm mb-2
                            dark:text-neutral-400"
              >
                {" "}
                by {review.user_id?.name || "Anonymous"} •{" "}
                {new Date(review.createdAt || review.date).toLocaleDateString()}
              </p>
              {userInfo &&
                (userInfo._id === review.user_id ||
                  userInfo._id === review.user_id?._id) && (
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => handleEditClick(review)}
                      className="text-blue-500 hover:text-blue-700 text-sm
                                 dark:text-blue-400 dark:hover:text-blue-300"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(review._id)}
                      className="text-red-500 hover:text-red-700 text-sm
                                 dark:text-red-400 dark:hover:text-red-300"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                )}
              <p className="mt-3 text-gray-700 dark:text-neutral-200">
                {review.content}
              </p>{" "}
              <div
                className="mt-4 flex items-center text-sm text-gray-500
                              dark:text-neutral-400"
              >
                {" "}
                <button
                  onClick={() => handleVote(review._id, true)}
                  className="flex items-center mr-4 hover:text-blue-600
                             dark:hover:text-blue-400"
                >
                  <ThumbUpIcon className="h-4 w-4 mr-1" />
                  Helpful ({review.helpfulCount || 0})
                </button>
                <button
                  onClick={() => handleVote(review._id, false)}
                  className="flex items-center hover:text-blue-600
                             dark:hover:text-blue-400"
                >
                  <ThumbDownIcon className="h-4 w-4 mr-1" />
                  Not Helpful ({review.notHelpfulCount || 0})
                </button>
              </div>
            </div>
          ))
        ) : (
          <div
            className="bg-white rounded-lg shadow-sm p-6 text-center py-12
                          dark:bg-neutral-800 dark:shadow-neutral-900/30"
          >
            {" "}
            <p className="text-gray-500 dark:text-neutral-400">
              {" "}
              Be the first to review this product!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewComponent;
