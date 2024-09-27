import React from 'react';
import '../css/AboutSection.css'; // Make sure to create this CSS file

function AboutSection() {
    return (
        <section className="about-section">
            <div className="about-content-wrapper">
                <h2 className="about-heading">About City Taxi</h2>
                <p className="about-description">
                    City Taxi offers reliable and affordable transportation solutions for all your needs. Our fleet is available 24/7 to get you to your destination comfortably and on time.
                </p>
                <p className="about-rate">Rate: <strong>Rs. 90 per km</strong></p>
                <button className="learn-more-btn" aria-label="Learn more about City Taxi">Learn More</button>
            </div>
            <div className="about-image-wrapper">
                <img 
                    src="/images/taxi-booking-driver-app.png" 
                    alt="City Taxi service vehicles" 
                    className="about-image" 
                />
            </div>
        </section>
    );
}

export default AboutSection;
