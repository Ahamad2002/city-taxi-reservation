import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/AdminNavbar.css'; // Ensure the CSS is linked correctly

function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear session storage
    navigate('/login'); // Navigate to login on logout
  };

  return (
    <nav className="admin-navbar">
      <div className="logo">
        <img src="/images/logo.png" alt="City Taxi Logo" className="logo-img" />
        <span className="logo-name">City Taxi</span>
      </div>
      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
      <li>
          <NavLink 
            to="/admin-dashboard" 
            end
            className={({ isActive }) => (isActive ? 'active-link' : '')}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-dashboard/manage-users" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Manage Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-dashboard/view-bookings" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            View Bookings
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-dashboard/manage-drivers" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Manage Drivers
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin-dashboard/reports" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Reports
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

export default AdminNavbar;
