import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Using for navigation after login
import '../css/LoginPage.css'; // Ensure this CSS file is created

function LoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Use navigate for routing after successful login

    // Handle input field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    // Handle form submit for login
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', formData); // Replace with your actual backend URL
            const { token, dashboardUrl } = response.data;

            // Store JWT token in localStorage for authentication
            localStorage.setItem('authToken', token);

            // Redirect to the appropriate dashboard
            navigate(dashboardUrl);
        } catch (error) {
            // Set the error message from the backend, or show a generic message if it doesn't exist
            setErrorMessage(error.response?.data || 'Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-image">
                <img src="/images/back.png" alt="Side Visual" />
            </div>
            <div className="login-form">
                <div className="login-logo">
                    <img src="/images/logo.png" alt="City Taxi Logo" />
                    <h2>CITY TAXI</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* Display the error message */}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleInputChange}
                        placeholder="Enter your username" 
                        required 
                    />

                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleInputChange}
                        placeholder="Enter your password" 
                        required 
                    />

                    <div className="additional-options">
                        <a href="/forgot-password">Forgot Password?</a>
                        <a href="/signup">Sign Up</a>
                    </div>

                    <button type="submit" className="login-btn">LOGIN</button>
                    <button type="button" className="gmail-login-btn">
                        <img src="/images/google.png" alt="Google Icon" />
                        Login with Gmail
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
