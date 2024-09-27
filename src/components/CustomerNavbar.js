import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/CustomerNavbar.css'; // Ensure your CSS is correctly linked

function CustomerNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear session storage
    navigate('/login'); // Navigate to login on logout
  };

  return (
    <nav className="customer-navbar">
      <div className="logo">
        <img src="/images/logo.png" alt="City Taxi Logo" className="logo-img" />
        <span className="logo-name">City Taxi</span>
      </div>
      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li>
          <NavLink 
            to="/customer-dashboard" 
            end
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/customer-dashboard/book-ride" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Book Ride
          </NavLink>
        </li>
        <li>
          <NavLink to="/customer-dashboard/rate-driver" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Rate Driver
          </NavLink>
        </li>
        <li>
          <NavLink to="/customer-dashboard/profile" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Profile
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </li>
      </ul>
      <div className="menu-toggle" onClick={handleMenuToggle}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}

export default CustomerNavbar;
