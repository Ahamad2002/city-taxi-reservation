import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../css/ViewRatings.css'; // Import the updated CSS file

function ViewRatings() {
    const [ratings, setRatings] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // Define the fetchRatings function using useCallback to prevent unnecessary re-creation
    const fetchRatings = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`http://localhost:3001/ratings/view-ratings?page=${page}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.length === 0) {
                setHasMore(false); // No more data to load
            } else {
                // Filter out any duplicate ratings
                setRatings((prevRatings) => {
                    const newRatings = response.data.filter(
                        (newRating) => !prevRatings.some(
                            (existingRating) => existingRating.id === newRating.id
                        )
                    );
                    return [...prevRatings, ...newRatings];
                });
            }
            setLoading(false);
        } catch (error) {
            setErrorMessage('Error fetching ratings.');
            setLoading(false);
        }
    }, [page]); // Add 'page' as a dependency

    useEffect(() => {
        fetchRatings();
    }, [fetchRatings]); // Now fetchRatings is properly included in the dependency array

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    // Helper function to render stars
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={i <= rating ? 'filled' : 'empty'}>
                    &#9733;
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="ratings-page">
            <h2>Customer Ratings & Feedback</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="ratings-container">
                {ratings.map((rating, index) => (
                    <div className="rating-card" key={index}>
                        <div className="rating-header">
                            <h4>{rating.username}</h4>
                            <div className="rating-stars">{renderStars(rating.rating)}</div>
                        </div>
                        <div className="rating-content">
                            <p>Feedback: {rating.feedback}</p>
                            <p className="rating-date">
                                <small>{new Date(rating.created_at).toLocaleDateString()}</small>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {hasMore && (
                <button className="load-more-btn" onClick={handleLoadMore} disabled={loading}>
                    {loading ? 'Loading...' : 'Load More'}
                </button>
            )}
        </div>
    );
}

export default ViewRatings;
