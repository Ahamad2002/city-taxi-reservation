import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/DriverNavbar.css'; // Ensure you have a separate CSS file for the driver navbar

function DriverNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear session storage
    navigate('/login'); // Navigate to login on logout
  };

  return (
    <nav className="driver-navbar">
      <div className="logo">
        <img src="/images/logo.png" alt="City Taxi Logo" className="logo-img" />
        <span className="logo-name">City Taxi</span>
      </div>
      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li>
          <NavLink 
            to="/driver-dashboard" 
            end
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/driver-dashboard/my-rides" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            My Rides
          </NavLink>
        </li>
        <li>
          <NavLink to="/driver-dashboard/view-ratings" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            View Ratings
          </NavLink>
        </li>
        <li>
          <NavLink to="/driver-dashboard/dprofile" className={({ isActive }) => (isActive ? 'active-link' : '')}>
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

export default DriverNavbar;
