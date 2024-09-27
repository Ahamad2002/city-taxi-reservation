const jwt = require('jsonwebtoken');
const connection = require('./db'); // Database connection
const secretKey = 'TVtiUNQDSE75FCX1wKct0b4Jr1zfm5J0'; // Replace this with a strong secret key

// Function to handle user login
const loginUser = (username, password, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ?';

    connection.query(sql, [username], (error, results) => {
        if (error) {
            console.error('Error querying user:', error);
            return callback({ message: 'Server error' }, null);
        }

        if (results.length === 0) {
            return callback({ message: 'Invalid username or password' }, null);
        }

        const user = results[0];

        // Directly compare the entered password with the stored password
        if (password !== user.password) {
            return callback({ message: 'Invalid username or password' }, null);
        }

        // Generate JWT token with user details
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            secretKey,
            { expiresIn: '1h' } // Token will expire in 1 hour
        );

        // Determine which dashboard URL to return based on the user's role
        let dashboardUrl;
        if (user.role === 'customer') {
            dashboardUrl = '/customer-dashboard';
        } else if (user.role === 'driver') {
            dashboardUrl = '/driver-dashboard';
        } else if (user.role === 'admin') {
            dashboardUrl = '/admin-dashboard';
        } else {
            return callback({ message: 'Invalid user role' }, null);
        }

        // Return the JWT token and the dashboard URL
        callback(null, { token, dashboardUrl });
    });
};

module.exports = { loginUser };
