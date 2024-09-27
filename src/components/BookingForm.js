import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet-routing-machine';
import '../css/BookingForm.css';

// Fetch address using OpenCage API
async function fetchAddress(query, callback) {
    const apiKey = '6c2c4725c8954f93998ded4ff58b4743'; // Replace with your OpenCage API key
    try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}`);
        if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            const address = response.data.results[0].formatted;
            callback({ lat, lng }, address);
        }
    } catch (error) {
        console.error('Error fetching address:', error);
    }
}

// Calculate distance using OpenRouteService API
async function calculateDistance(startCoords, endCoords, setDistance) {
    const apiKey = '5b3ce3597851110001cf6248b692cc93b6bc41b3bee7b18171044cfe'; // Replace with your OpenRouteService API key
    try {
        const response = await axios.post(
            'https://api.openrouteservice.org/v2/directions/driving-car',
            { coordinates: [[startCoords.lng, startCoords.lat], [endCoords.lng, endCoords.lat]] },
            { headers: { Authorization: apiKey } }
        );

        if (response.data.routes.length > 0) {
            const distanceInMeters = response.data.routes[0].summary.distance;
            const distanceInKm = (distanceInMeters / 1000).toFixed(2); // Convert meters to kilometers
            setDistance(distanceInKm);
        }
    } catch (error) {
        console.error('Error calculating distance:', error);
    }
}

function LocationMarker({ startMarkerPosition, endMarkerPosition, setDistance }) {
    useEffect(() => {
        if (startMarkerPosition && endMarkerPosition) {
            calculateDistance(startMarkerPosition, endMarkerPosition, setDistance);
        }
    }, [startMarkerPosition, endMarkerPosition, setDistance]);

    return (
        <>
            {startMarkerPosition && (
                <Marker
                    position={startMarkerPosition}
                    icon={new L.Icon({
                        iconUrl: require('../location-pin.png'),
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                    })}
                />
            )}
            {endMarkerPosition && (
                <Marker
                    position={endMarkerPosition}
                    icon={new L.Icon({
                        iconUrl: require('../location-pin.png'),
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                    })}
                />
            )}
        </>
    );
}

function BookingForm() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        passengers: '',
        startDestination: '',
        endDestination: '',
        date: '',
        time: '',
        distance: '',
    });
    const [startMarkerPosition, setStartMarkerPosition] = useState(null);
    const [endMarkerPosition, setEndMarkerPosition] = useState(null);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'startDestination' && value.trim() !== '') {
            fetchAddress(value, (coords) => setStartMarkerPosition(coords));
        }
        if (name === 'endDestination' && value.trim() !== '') {
            fetchAddress(value, (coords) => setEndMarkerPosition(coords));
        }
    };

    const handleLocateClick = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setStartMarkerPosition({ lat: latitude, lng: longitude });
                fetchAddress(`${latitude},${longitude}`, (coords, address) => {
                    setFormData((prev) => ({ ...prev, startDestination: address }));
                });
            },
            () => {
                alert('Unable to retrieve your location');
            }
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Check if all required fields are filled
        if (!formData.name || !formData.phone || !formData.passengers || 
            !formData.startDestination || !formData.endDestination || 
            !formData.date || !formData.time || !formData.distance) {
            alert('Please fill all fields before submitting.');
            return; // Stop the function if any fields are missing
        }
    
        const apiUrl = 'http://localhost:3001/bookings'; // Adjust if your server's location differs
        try {
            const response = await axios.post(apiUrl, formData);
            if (response.status === 200) {
                alert('Booking submitted successfully!');
                console.log('Server response:', response.data);
                // Clear the form fields by resetting formData state
                setFormData({
                    name: '',
                    phone: '',
                    passengers: '',
                    startDestination: '',
                    endDestination: '',
                    date: '',
                    time: '',
                    distance: '',
                });
                // Optionally reset map markers here if needed
                setStartMarkerPosition(null);
                setEndMarkerPosition(null);
            } else {
                throw new Error('Failed to submit booking');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error submitting booking: ' + error.message);
        }
    };
    
  

    const setDistance = (distance) => {
        setFormData((prev) => ({ ...prev, distance }));
    };

    return (
        <div className="taxi-booking-form1">
            <form onSubmit={handleSubmit}>
                <div className="form1-header">
                    <h1>Book Your Taxi Online</h1>
                </div>
                <div className="form1-content">
                    <div className="form1-fields">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            name="passengers"
                            placeholder="Passengers#"
                            value={formData.passengers}
                            onChange={handleInputChange}
                        />
                        <div className="location-input">
                            <input
                                type="text"
                                name="startDestination"
                                placeholder="Start Destination"
                                value={formData.startDestination}
                                onChange={handleInputChange}
                            />
                            <button type="button" onClick={handleLocateClick} className="location-btn">
                                Use Current Location
                            </button>
                        </div>
                        <input
                            type="text"
                            name="endDestination"
                            placeholder="End Destination"
                            value={formData.endDestination}
                            onChange={handleInputChange}
                        />
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                        />
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            name="distance"
                            placeholder="Distance (km)"
                            value={formData.distance}
                            readOnly
                        />
                    </div>
                    <div className="map-container">
                        <MapContainer center={[7.8731, 80.7718]} zoom={8} style={{ height: 300, width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationMarker
                                startMarkerPosition={startMarkerPosition}
                                endMarkerPosition={endMarkerPosition}
                                setDistance={setDistance}
                            />
                        </MapContainer>
                    </div>
                </div>
                <button type="submit" className="book-now-btn">
                    BOOK TAXI NOW
                </button>
            </form>
        </div>
    );
}

export default BookingForm;
