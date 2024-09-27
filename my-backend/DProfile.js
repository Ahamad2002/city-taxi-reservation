const express = require('express');
const jwt = require('jsonwebtoken');
const connection = require('./db'); // Assuming you have your database connection set up
const multer = require('multer'); // Multer to handle file uploads
const router = express.Router();
const secretKey = 'TVtiUNQDSE75FCX1wKct0b4Jr1zfm5J0'; // Your JWT secret key

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

// Route to get the logged-in driver's profile information
router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.userId; // Get user ID from JWT

    const sql = `SELECT u.username, u.email, d.mobile, d.address, d.license_id, d.identity_number, 
                        d.vehicle_number, d.vehicle_type, d.vehicle_image, u.image AS profile_image
                 FROM users u 
                 LEFT JOIN drivers d ON u.id = d.user_id 
                 WHERE u.id = ?`;

    connection.query(sql, [userId], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Error fetching driver data' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const driver = results[0];
        if (driver.vehicle_image) {
            driver.vehicle_image = Buffer.from(driver.vehicle_image).toString('base64'); // Convert binary image to base64
        }
        if (driver.profile_image) {
            driver.profile_image = Buffer.from(driver.profile_image).toString('base64'); // Convert binary image to base64
        }
        res.json({ driver });
    });
});

// Route to update the driver's profile
router.post('/update', authenticateToken, upload.fields([{ name: 'vehicle_image' }, { name: 'profile_image' }]), (req, res) => {
    const userId = req.user.userId;
    const { username, email, mobile, address, license_id, identity_number, vehicle_number, vehicle_type } = req.body;
    let vehicle_image = req.files['vehicle_image'] ? req.files['vehicle_image'][0].buffer : null;
    let profile_image = req.files['profile_image'] ? req.files['profile_image'][0].buffer : null;

    const updateUserSql = `UPDATE users SET username = ?, email = ?, image = IFNULL(?, image) WHERE id = ?`;
    const updateDriverSql = `INSERT INTO drivers (user_id, mobile, address, license_id, identity_number, 
                              vehicle_number, vehicle_type, vehicle_image)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE
                             mobile = VALUES(mobile), address = VALUES(address), license_id = VALUES(license_id), 
                             identity_number = VALUES(identity_number), vehicle_number = VALUES(vehicle_number), 
                             vehicle_type = VALUES(vehicle_type), vehicle_image = IFNULL(VALUES(vehicle_image), vehicle_image)`;

    connection.query(updateUserSql, [username, email, profile_image, userId], (error) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Error updating user data' });
        }

        connection.query(updateDriverSql, [userId, mobile, address, license_id, identity_number, vehicle_number, vehicle_type, vehicle_image], (error) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: 'Error updating driver data' });
            }
            res.json({ message: 'Profile updated successfully' });
        });
    });
});

module.exports = router;
