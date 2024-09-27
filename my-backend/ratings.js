// ratings.js
const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('./db'); // Assuming db.js exports your MySQL connection
const router = express.Router();
const secretKey = 'TVtiUNQDSE75FCX1wKct0b4Jr1zfm5J0'; // Your JWT secret key

// Middleware to authenticate and verify the JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // Attach user info to request object
        next();
    });
};

// Endpoint to fetch ratings for a driver
router.get('/view-ratings', authenticateToken, (req, res) => {
    const driverId = req.user.userId; // Assuming the logged-in driver ID is part of the JWT
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const query = `
        SELECT r.rating, r.feedback, r.created_at, u.username
        FROM ratings r
        JOIN users u ON r.user_id = u.id
        WHERE r.driver_id = ?
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?`;

    connection.query(query, [driverId, limit, offset], (error, results) => {
        if (error) {
            console.error('Error fetching ratings:', error);
            return res.status(500).json({ message: 'Error fetching ratings' });
        }
        res.json(results);
    });
});

module.exports = router;
