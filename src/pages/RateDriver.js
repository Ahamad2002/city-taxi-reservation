import React, { useState } from 'react';
import '../css/RateDriver.css'; // Add CSS for styling

function RateDriver() {
  const [rating, setRating] = useState(0);  // Star rating state
  const [hover, setHover] = useState(null); // For hover effect on stars
  const [feedback, setFeedback] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackSubmit = () => {
    if (rating < 1 || rating > 5) {
      alert('Please provide a rating between 1 and 5.');
      return;
    }
    if (feedback.trim() === '') {
      alert('Please provide feedback.');
      return;
    }

    // Handle submission logic here
    alert(`Thank you for your feedback! Rating: ${rating}, Feedback: ${feedback}`);

    // Reset the form after submission
    setRating(0);
    setFeedback('');
    setShowFeedbackForm(false);
  };

  return (
    <div className="rate-driver">
      <h2>Rate Your Driver</h2>
      <div className="ride-details">
        <p><strong>From:</strong> Maho</p>
        <p><strong>To:</strong> Kurunegala</p>
        <p><strong>Distance:</strong> 47.22 KM</p>
        <p><strong>Driver Name:</strong> Rinas</p>
      </div>

      <button className="add-feedback-btn" onClick={() => setShowFeedbackForm(true)}>
        Add Feedback
      </button>

      {showFeedbackForm && (
        <div className="feedback-form">
          <h3>Provide your feedback</h3>
          <label><strong>Rating:</strong></label>
          
          {/* Star rating system */}
          <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              const currentRating = index + 1;
              return (
                <span
                  key={index}
                  className={currentRating <= (hover || rating) ? 'on' : 'off'}
                  onClick={() => setRating(currentRating)}
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(null)}
                >
                  &#9733;
                </span>
              );
            })}
          </div>

          <label>
            <strong>Feedback:</strong>
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              placeholder="Enter your feedback here"
              rows="4"
            />
          </label>

          <button className="submit-btn" onClick={handleFeedbackSubmit}>
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}

export default RateDriver;
