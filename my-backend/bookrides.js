const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const stripe = require('stripe')('pk_test_51Q3JbYGLKg6MJgnUhCHTcWbw0Mae2h4E102cloYXfw5dlO0K1Say5pg9DlhV3GQZRisduAQZf8lpYXEO6egRwfQD00Iz1QORYO'); // Replace with your Stripe secret key
const twilio = require('twilio');
const twilioClient = new twilio('AC684f56acdefef6944f418fffab4f1483', '95eebb461eec78bf7052344e3e1e7a43'); // Replace with correct credentials
const connection = require('./db'); // Database connection from db.js
const app = express();
const secretKey = 'TVtiUNQDSE75FCX1wKct0b4Jr1zfm5J0'; // Your secret key for JWT

app.use(bodyParser.json());

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

// Route to calculate distance using OpenRouteService
const calculateDistance = async (startCoords, endCoords) => {
    const apiKey = '5b3ce3597851110001cf6248b692cc93b6bc41b3bee7b18171044cfe'; // Replace with OpenRouteService API Key
    try {
        const response = await axios.post(
            'https://api.openrouteservice.org/v2/directions/driving-car',
            { coordinates: [[startCoords.lng, startCoords.lat], [endCoords.lng, endCoords.lat]] },
            { headers: { Authorization: apiKey } }
        );
        if (response.data.routes.length > 0) {
            const distanceInMeters = response.data.routes[0].summary.distance;
            const distanceInKm = (distanceInMeters / 1000).toFixed(2); // Convert meters to kilometers
            return distanceInKm;
        }
    } catch (error) {
        console.error('Error calculating distance:', error);
        return null;
    }
};

// Route to get the address using OpenCage API
const getAddressFromCoords = async (latitude, longitude) => {
    const apiKey = '6c2c4725c8954f93998ded4ff58b4743'; // Replace with OpenCage API Key
    try {
        const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
        );
        if (response.data.results.length > 0) {
            return response.data.results[0].formatted;
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        return null;
    }
};

// Route to handle booking a ride
app.post('/book-ride', authenticateToken, async (req, res) => {
    const { start_lat, start_lng, end_lat, end_lng, driverId } = req.body;
    const userId = req.user.id;

    // Get the address from the coordinates
    const startLocation = await getAddressFromCoords(start_lat, start_lng);
    const endLocation = await getAddressFromCoords(end_lat, end_lng);

    if (!startLocation || !endLocation) {
        return res.status(400).json({ message: 'Unable to retrieve address for the provided coordinates.' });
    }

    // Calculate distance between the two locations
    const distance = await calculateDistance({ lat: start_lat, lng: start_lng }, { lat: end_lat, lng: end_lng });

    if (!distance) {
        return res.status(400).json({ message: 'Unable to calculate distance between the two locations.' });
    }

    // Calculate the fare based on the distance (e.g., 90 Rs per KM)
    const fare = (distance * 90).toFixed(2);

    // Insert booking into the database
    const sql = `INSERT INTO rides (user_id, driver_id, start_location, end_location, distance, fare, status)
                 VALUES (?, ?, ?, ?, ?, ?, 'pending')`;
    connection.query(sql, [userId, driverId, startLocation, endLocation, distance, fare], (error, result) => {
        if (error) {
            console.error('Error inserting ride:', error);
            return res.status(500).json({ message: 'Server error' });
        }

        res.status(200).json({
            success: true,
            message: 'Ride booked successfully',
            ride: {
                start_location: startLocation,
                end_location: endLocation,
                distance,
                fare,
            },
        });
    });
});

// Stripe payment route
app.post('/create-payment-intent', authenticateToken, async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe accepts amount in cents
            currency: 'usd',
            payment_method_types: ['card'],
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: 'Error creating payment intent' });
    }
});

// Route to send SMS confirmation using Twilio
app.post('/send-sms', authenticateToken, async (req, res) => {
    const { phoneNumber, message } = req.body;

    try {
        const smsResponse = await twilioClient.messages.create({
            body: message,
            from: '+12295980626', // Replace with your Twilio phone number
            to: phoneNumber,
        });

        res.status(200).json({ success: true, message: 'SMS sent successfully', sid: smsResponse.sid });
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({ message: 'Failed to send SMS' });
    }
});

// Route to find active drivers within a 1km radius
app.get('/nearby-drivers', authenticateToken, async (req, res) => {
    const { latitude, longitude } = req.query;

    const query = `
        SELECT d.driver_id, d.location, u.username, u.vehicle_type, u.rating
        FROM driver_rides d
        JOIN drivers u ON d.driver_id = u.user_id
        WHERE d.status = 'active'
        AND ST_Distance_Sphere(POINT(?, ?), POINT(d.lat, d.lng)) <= 1000
        ORDER BY u.rating DESC
        LIMIT 10`;

    connection.query(query, [longitude, latitude], (error, drivers) => {
        if (error) {
            console.error('Error fetching nearby drivers:', error);
            return res.status(500).json({ message: 'Server error' });
        }
        res.json({ drivers });
    });
});

// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
