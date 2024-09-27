import React from 'react';
import '../css/ServicesSection.css';

function ServicesSection() {
  return (
    <div className="services-section">
      <div className="service-header">
        <span className="service-highlight"></span>
        <h2>Our Services</h2>
      </div>
      <div className="service-cards">
        {/* Regular Taxi Service */}
        <div className="service-card">
          <img src="/images/personal-ride.png" alt="Personal Taxi Service" />
          <h3>Personal Ride</h3>
          <p>Offering convenient and reliable taxi rides for your everyday needs. Our services ensure you reach your destination safely and on time.</p>
          <button className="read-more-btn">READ MORE</button>
        </div>
        {/* Corporate Taxi Service */}
        <div className="service-card">
          <img src="/images/corporate-ride.jpg" alt="Corporate Ride" />
          <h3>Corporate Accounts</h3>
          <p>Enhance your business operations with our corporate taxi services designed for efficiency and professionalism.</p>
          <button className="read-more-btn">READ MORE</button>
        </div>
        {/* Special Events Transportation */}
        <div className="service-card">
          <img src="/images/event-transport.jpeg" alt="Event Transport" />
          <h3>Event Transportation</h3>
          <p>Reliable transportation solutions for special events, ensuring that your guests arrive in style and comfort.</p>
          <button className="read-more-btn">READ MORE</button>
        </div>
      </div>
    </div>
  );
}

export default ServicesSection;
