const express = require('express'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const { addUser } = require('./users');
const { addBooking } = require('./booking');
const { loginUser } = require('./login');
const profileRoutes = require('./profile'); 
const dprofileRoutes = require('./DProfile');
const ridesRoutes = require('./myrides');  // Updated name for clarity
const ratingsRoutes = require('./ratings');


const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON data

// Booking endpoint
app.post('/bookings', (req, res) => {
    addBooking(req.body, (error, result) => {
        if (error) {
            console.error('Error processing booking:', error);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).send(result);
    });
});

// User signup endpoint
app.post('/signup', (req, res) => {
    addUser(req.body, (error, result) => {
        if (error) {
            console.error('Error signing up user:', error);
            res.status(500).send('Error signing up user');
            return;
        }
        res.status(200).send(result);
    });
});

// User login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    loginUser(username, password, (error, result) => {
        if (error) {
            console.error('Login error:', error);
            return res.status(400).send(error.message);
        }
        res.status(200).send(result);
    });
});

// Profile routes
app.use('/profile', profileRoutes);  // Regular user profile routes
app.use('/dprofile', dprofileRoutes);  // Driver-specific profile routes

// Ride routes
app.use('/myrides', ridesRoutes);  // Driver's ride management

app.use('/ratings', ratingsRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
