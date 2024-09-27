import React from 'react';
import AdminNavbar from '../components/AdminNavbar'; // Import AdminNavbar
import { Outlet } from 'react-router-dom'; // For nested routes

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <AdminNavbar /> {/* Admin navigation bar */}
      <div className="dashboard-content">
        <Outlet /> {/* Outlet will render the nested routes (e.g., ManageUsers, ViewBookings) */}
      </div>
    </div>
  );
}

export default AdminDashboard;
