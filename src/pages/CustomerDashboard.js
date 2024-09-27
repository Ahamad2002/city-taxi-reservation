import React from 'react';
import CustomerNavbar from '../components/CustomerNavbar'; // Import the navigation bar
import { Outlet } from 'react-router-dom'; // Import Outlet from react-router-dom

function CustomerDashboard() {
  return (
    <div className="customer-dashboard">
      <CustomerNavbar />
      <div className="dashboard-content">
        <Outlet />  
      </div>
    </div>
  );
}

export default CustomerDashboard;
