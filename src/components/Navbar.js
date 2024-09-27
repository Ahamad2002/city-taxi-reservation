import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/navbar.css';

function CityTaxiNavbar() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  return (
    <Navbar bg="light" expand="lg" className="city-taxi-navbar">
      <Navbar.Brand className="navbar-brand">
        <img
          src="/images/Logo.png"
          alt="City Taxi"
          className="logo"
        />
        <span className="brand-name">CITY TAXI</span>
      </Navbar.Brand>
      
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {/* Navigate to the login page when Login button is clicked */}
          <Button 
            variant="outline-primary" 
            className="mr-2 login-btn" 
            onClick={() => navigate('/login')}
          >
            Login
          </Button>

          {/* Navigate to the signup page when Sign Up button is clicked */}
          <Button 
            variant="primary" 
            className="signup-btn" 
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default CityTaxiNavbar;
