import React, { useState, useEffect } from "react";
import "./DescriptionBox.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import PropTypes from 'prop-types';

const api = import.meta.env.VITE_API_BASE_URL;

const DescriptionBox = ({ productId }) => {
  console.log('[DescriptionBox] Initializing with productId:', productId); // Debug log
  
  // Validate productId at the start
  if (!productId) {
    console.error('[DescriptionBox] Error: Missing productId');
    return <div className="error">Please provide a product ID</div>;
  }

  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const url = `${api}/products/${productId}/reviews`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        setReviews(data.reviews || []);
      } catch (error) {

        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.rating) {
      setError('Please select a rating');
      return;
    }
    
    if (!newReview.comment.trim()) {
      setError('Please write a review');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('You must be logged in to submit a review');
      }

      const url = `${api}/products/${productId}/reviews`;
      console.log('[DescriptionBox] Posting to:', url); // Debug log
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const data = await response.json();
      console.log('[DescriptionBox] Review submitted successfully:', data); // Debug log
      
      setReviews([data.review, ...reviews]);
      setNewReview({ rating: 0, comment: "" });
    } catch (error) {
      console.error('[DescriptionBox] Error submitting review:', error); // Debug log
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const emptyStars = 5 - fullStars;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<img key={`full-${i}`} src={star_icon} alt="Full star" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<img key={`empty-${i}`} src={star_dull_icon} alt="Empty star" />);
    }

    return stars;
  };

  const renderRatingStars = (isInput = false) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onMouseEnter={isInput ? () => setHoverRating(star) : null}
            onMouseLeave={isInput ? () => setHoverRating(0) : null}
            onClick={isInput ? () => {
              console.log('[DescriptionBox] Selected rating:', star); // Debug log
              setNewReview({ ...newReview, rating: star });
            } : null}
          >
            {(isInput ? hoverRating : newReview.rating) >= star ? (
              <img src={star_icon} alt="Full star" />
            ) : (
              <img src={star_dull_icon} alt="Empty star" />
            )}
          </span>
        ))}
      </div>
    );
  };


  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div
          className={`descriptionbox-navbox ${
            activeTab === "description" ? "active" : ""
          }`}
          onClick={() => {
            console.log('[DescriptionBox] Switching to description tab'); // Debug log
            setActiveTab("description");
          }}
        >
          Description
        </div>
        <div
          className={`descriptionbox-navbox ${
            activeTab === "reviews" ? "active" : "fade"
          }`}
          onClick={() => {
            console.log('[DescriptionBox] Switching to reviews tab'); // Debug log
            setActiveTab("reviews");
          }}
        >
          Reviews ({reviews.length})
        </div>
      </div>

      <div className="descriptionbox-description">
        {activeTab === "description" ? (
          <>
            <p>
              An e-commerce website is an online platform that facilitates the
              buying and selling of products or services over the internet.
            </p>
            <p>
              E-commerce websites typically display products or services along
              with detailed descriptions, images, prices and any available
              variations.
            </p>
          </>
        ) : (
          <div className="reviews-section">
            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                {error}
              </div>
            )}

            {isLoading ? (
              <p>Loading reviews...</p>
            ) : reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review._id || review.id} className="review-item">
                    <div className="review-header">
                      <h4>{review.name}</h4>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                        <span className="review-date">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No reviews yet. Be the first to review!</p>
            )}

            <div className="add-review">
              <h3>Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label>Your Rating</label>
                  {renderRatingStars(true)}
                </div>
                <div className="form-group">
                  <label htmlFor="review-comment">Your Review</label>
                  <textarea
                    id="review-comment"
                    value={newReview.comment}
                    onChange={(e) => {
                      console.log('[DescriptionBox] Review comment changed:', e.target.value); // Debug log
                      setNewReview({ ...newReview, comment: e.target.value });
                    }}
                    required
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  className="submit-review-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

DescriptionBox.propTypes = {
  productId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
};

export default DescriptionBox;