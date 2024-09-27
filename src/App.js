import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerDashboard from './pages/CustomerDashboard';
import CHome from './pages/CHome';
import BookRide from './pages/BookRide';
import RateDriver from './pages/RateDriver';
import Profile from './pages/Profile';
import DriverDashboard from './pages/DriverDashboard';
import DHome from './pages/DHome'; 
import MYRide from './pages/MyRide';
import DProfile from './pages/DProfile';
import ViewRatings from './pages/ViewRatings'; 
import AdminDashboard from './pages/AdminDashboard';
import AHome from './pages/AHome'; // Admin home page
import ManageUsers from './pages/ManageUsers'; // Manage users
import ViewBookings from './pages/ViewBookings'; // View bookings
import ManageDrivers from './pages/ManageDrivers'; // Manage drivers
import Reports from './pages/Reports'; // View reports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Customer Dashboard Routes */}
        <Route path="/customer-dashboard" element={<CustomerDashboard />}>
          <Route index element={<CHome />} />  
          <Route path="chome" element={<CHome />} />
          <Route path="book-ride" element={<BookRide />} />
          <Route path="rate-driver" element={<RateDriver />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Driver Dashboard Routes */}
        <Route path="/driver-dashboard" element={<DriverDashboard />}>
          <Route index element={<DHome />} />
          <Route path="my-rides" element={<MYRide />} />
          <Route path="view-ratings" element={<ViewRatings />} />
          <Route path="dprofile" element={<DProfile />} />
        </Route>

        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<AHome />} /> 
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="view-bookings" element={<ViewBookings />} />
          <Route path="manage-drivers" element={<ManageDrivers />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
