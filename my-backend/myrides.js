const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('./db');  // Database connection
const axios = require('axios');
const router = express.Router();
const secretKey = 'TVtiUNQDSE75FCX1wKct0b4Jr1zfm5J0';  // Your JWT secret key

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid
        req.user = user;
        next();
    });
};

// OpenCage API key
const OPENCAGE_API_KEY = '6c2c4725c8954f93998ded4ff58b4743';  // Replace with your actual OpenCage API key

// Helper function to get address from latitude and longitude using OpenCage API
const getLocationFromCoords = async (latitude, longitude) => {
    try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`);
        const data = response.data;
        if (data.results && data.results.length > 0) {
            return data.results[0].formatted;  // Return the formatted address
        }
        return null;
    } catch (error) {
        console.error('Error fetching address from OpenCage:', error);
        return null;
    }
};

// Route to assign or unassign location and update status
router.post('/assign-location', authenticateToken, async (req, res) => {
    const driverId = req.user.userId;
    const { latitude, longitude } = req.body;

    let location = await getLocationFromCoords(latitude, longitude);

    if (!location) {
        return res.status(500).json({ message: 'Error fetching location.' });
    }

    const checkQuery = `SELECT status FROM driver_rides WHERE driver_id = ?`;
    connection.query(checkQuery, [driverId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Database error' });
        }

        let newStatus;
        if (results.length > 0) {
            newStatus = results[0].status === 'active' ? 'inactive' : 'active';
            const updateQuery = `UPDATE driver_rides SET location = ?, status = ? WHERE driver_id = ?`;
            connection.query(updateQuery, [location, newStatus, driverId], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error updating status' });
                }
                return res.json({ status: newStatus, location });
            });
        } else {
            newStatus = 'active';
            const insertQuery = `INSERT INTO driver_rides (driver_id, location, status) VALUES (?, ?, ?)`;
            connection.query(insertQuery, [driverId, location, newStatus], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error inserting new ride' });
                }
                return res.json({ status: newStatus, location });
            });
        }
    });
});


// Route to get driver's current ride status
router.get('/ride-status', authenticateToken, (req, res) => {
    const driverId = req.user.userId;

    const query = `SELECT location, status FROM driver_rides WHERE driver_id = ?`;
    connection.query(query, [driverId], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Error fetching ride status' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No ride data found' });
        }

        const ride = results[0];
        return res.json({ location: ride.location, status: ride.status });
    });
});

module.exports = router;
