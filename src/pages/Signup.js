import React, { useState } from 'react';
import axios from 'axios';
import '../css/SignUpPage.css'; // Ensure you link this CSS file correctly

function SignUpPage() {
    const initialState = {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'customer' // Set default role as 'customer'
    };

    const [formData, setFormData] = useState(initialState);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Exclude confirmPassword when sending to the backend
        const { confirmPassword, ...signupData } = formData;

        try {
            const response = await axios.post('http://localhost:3001/signup', signupData);
            if (response.status === 200) {
                console.log('Signup successful:', response.data);
                alert('Signup successful!');
                setFormData(initialState); // Reset the form state on successful signup
            } else {
                throw new Error('Failed to submit signup');
            }
        } catch (error) {
            console.error('Signup failed:', error);
            alert('Signup failed: ' + error.message);
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-image">
                <img src="/images/back.png" alt="Signup Visual" />
            </div>
            <div className="signup-form">
                <div className="signup-logo">
                    <img src="/images/logo.png" alt="City Taxi Logo" />
                    <h2>SIGN UP</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />

                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />

                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />

                    <label htmlFor="role">Role</label>
                    <select id="role" name="role" value={formData.role} onChange={handleInputChange}>
                        <option value="customer">Customer</option>
                        <option value="driver">Driver</option>
                    </select>

                    <button type="submit" className="signup-btn">SIGN UP</button>
                    <div className="login-link">
                        Already have an account? <a href="/login">Log In</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;
