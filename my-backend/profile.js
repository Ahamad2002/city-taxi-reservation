const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('./db'); 
const multer = require('multer'); 
const router = express.Router();
const secretKey = 'TVtiUNQDSE75FCX1wKct0b4Jr1zfm5J0'; 

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

// Multer setup for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to get the logged-in user's profile information
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.userId; // Get user ID from JWT

    const sql = `SELECT u.id, u.email, u.username, u.role, u.image, c.mobile, c.address 
                 FROM users u LEFT JOIN customers c ON u.id = c.user_id 
                 WHERE u.id = ?`;

    connection.query(sql, [userId], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Error fetching user data' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];
        if (user.image) {
            user.image = Buffer.from(user.image).toString('base64'); // Convert binary image to base64
        }
        res.json({ user });
    });
});

// Route to update the logged-in user's profile
router.post('/update', authenticateToken, upload.single('image'), (req, res) => {
    const userId = req.user.userId;
    const { username, email, mobile, address } = req.body;
    let image = req.file ? req.file.buffer : null;

    const updateUserSql = `UPDATE users SET username = ?, email = ?, image = IFNULL(?, image) WHERE id = ?`;
    const updateCustomerSql = `INSERT INTO customers (user_id, mobile, address)
                               VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE mobile = VALUES(mobile), address = VALUES(address)`;

    connection.query(updateUserSql, [username, email, image, userId], (error) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Error updating user data' });
        }

        // If there's no error, proceed to update/insert into customers table
        connection.query(updateCustomerSql, [userId, mobile, address], (error) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: 'Error updating customer data' });
            }
            res.json({ message: 'Profile updated successfully' });
        });
    });
});

module.exports = router;
