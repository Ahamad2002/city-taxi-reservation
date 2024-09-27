import React from 'react';
import '../css/BusinessPartnershipSection.css';

function BusinessPartnershipSection() {
  return (
    <div className="business-section">
      <div className="business-images">
        <img src="/images/1.jpg" alt="Corporate Client Boarding Taxi" />
      </div>
      <div className="business-content">
        <div className="content-header">
          <span className="header-highlight"></span>
          <h2>EXPLORE PARTNERSHIP OPPORTUNITIES</h2>
        </div>
        <h1>DEDICATED TO SUPPORTING YOUR BUSINESS</h1>
        <p>At City Taxi, we offer tailored transportation solutions that ensure your business operations run smoothly and efficiently.</p>
        <p><strong>Ahamad Rinas</strong> • Partnership Manager</p>
        <p>Contact Our Team Anytime:</p>
        <p><strong>+94 72 399 2102</strong></p>
        <button className="btn info-btn">CONTACT US</button>
      </div>
    </div>
  );
}

export default BusinessPartnershipSection;
