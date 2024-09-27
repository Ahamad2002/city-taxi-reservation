import React from 'react';
import DriverNavbar from '../components/DriverNavbar'; // Import the driver navbar
import { Outlet } from 'react-router-dom'; // Import Outlet to display child routes

function DriverDashboard() {
  return (
    <div className="driver-dashboard">
      <DriverNavbar />
      <div className="dashboard-content">
        <Outlet />  
      </div>
    </div>
  );
}

export default DriverDashboard;
