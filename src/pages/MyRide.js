import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import '../css/MyRide.css'; // Make sure to import the scoped CSS file

// Custom marker icon for Leaflet
const customIcon = new L.Icon({
    iconUrl: require('../location-pin.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function MyRide() {
    const [status, setStatus] = useState('inactive');
    const [location, setLocation] = useState(null);
    const [coords, setCoords] = useState(null);  // To store latitude and longitude
    const [buttonText, setButtonText] = useState('Assign Location');
    const [errorMessage, setErrorMessage] = useState('');

    // Fake booking data
    const bookingData = {
        customerName: 'Ishan',
        startLocation: 'Colombo',
        endLocation: 'Kandy',
        time: '10:30 AM',
    };

    // Fake finished ride data for history
    const finishedRides = [
        { id: 1, customer: 'Sameer', startLocation: 'Negombo', endLocation: 'Galle', time: '9:00 AM', date: '2023-09-23' },
        { id: 2, customer: 'Rinas', startLocation: 'Matara', endLocation: 'Hambantota', time: '1:30 PM', date: '2023-09-22' },
        { id: 3, customer: 'Nirasha', startLocation: 'Kurunegala', endLocation: 'Puttalam', time: '11:00 AM', date: '2023-09-21' },
    ];

    useEffect(() => {
        const fetchRideStatus = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://localhost:3001/myrides/ride-status', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStatus(response.data.status);
                setLocation(response.data.location);
                setButtonText(response.data.status === 'active' ? 'Unassign Location' : 'Assign Location');
            } catch (error) {
                setErrorMessage('Error fetching ride status');
            }
        };

        fetchRideStatus();
    }, []);

    const handleAssignLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const token = localStorage.getItem('authToken');
                    const response = await axios.post('http://localhost:3001/myrides/assign-location', {
                        latitude,
                        longitude
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    setCoords({ lat: latitude, lng: longitude });
                    setLocation(response.data.location);
                    setStatus(response.data.status);
                    setButtonText(response.data.status === 'active' ? 'Unassign Location' : 'Assign Location');
                } catch (error) {
                    setErrorMessage('Error assigning location');
                }
            });
        } else {
            setErrorMessage('Geolocation is not supported by this browser');
        }
    };

    const handleCancelBooking = () => {
        alert('Booking Cancelled');
    };

    const handleConfirmBooking = () => {
        alert('Booking Confirmed');
    };

    return (
        <div className="my-ride-page">
            <h2>My Rides</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <p>Status: <span className="status">{status}</span></p>
            {location && <p>Location: <span className="location">{location}</span></p>}
            <button onClick={handleAssignLocation}>{buttonText}</button>

            <div className="map-container">
                <MapContainer center={[7.8731, 80.7718]} zoom={8} style={{ height: 300, width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {coords && <Marker position={coords} icon={customIcon} />}
                </MapContainer>
            </div>

            {/* Booking Section */}
            <div className="booking-section">
                <h3>Current Booking</h3>
                <table className="booking-table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Start Location</th>
                            <th>End Location</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{bookingData.customerName}</td>
                            <td>{bookingData.startLocation}</td>
                            <td>{bookingData.endLocation}</td>
                            <td>{bookingData.time}</td>
                            <td>
                                <button className="cancel-btn" onClick={handleCancelBooking}>Cancel</button>
                                <button className="confirm-btn" onClick={handleConfirmBooking}>Confirm</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Finished Ride History */}
            <div className="history-section">
                <h3>Finished Ride History</h3>
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Start Location</th>
                            <th>End Location</th>
                            <th>Time</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {finishedRides.map(ride => (
                            <tr key={ride.id}>
                                <td>{ride.customer}</td>
                                <td>{ride.startLocation}</td>
                                <td>{ride.endLocation}</td>
                                <td>{ride.time}</td>
                                <td>{ride.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyRide;
