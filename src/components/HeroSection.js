import React from 'react';
import '../css/HeroSection.css';

function HeroSection() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Trusted & Cheapest Taxi Service Company</h1>
        <p>Taxi Driver for Hire</p>
        
        <p className="hero-description">
          City Taxi offers reliable taxi services across the city. 
          our goal is to ensure every journey you make is smooth and safe. 
          Experience the best in urban transportation!
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary">Learn More</button>
          <button className="btn btn-outline-primary">Find a Taxi</button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
