import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import '../css/BookRide.css';
import carIcon from '../assets/car.png';
import bikeIcon from '../assets/bike.png';
import vanIcon from '../assets/van.png';
import locationPinIconImage from '../assets/location-pin.png';
import rideHistoryIcon from '../assets/ride-history-icon.png'; // Import the ride history icon

// Import leaflet-routing-machine and its CSS
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Ensure L.Routing is defined
delete L.Icon.Default.prototype._getIconUrl;

const OpenCageApiKey = '6c2c4725c8954f93998ded4ff58b4743';
const KmRate = 90;

// Custom Marker Icons for vehicles
const vehicleIcons = {
  car: new L.Icon({ iconUrl: carIcon, iconSize: [25, 25] }),
  bike: new L.Icon({ iconUrl: bikeIcon, iconSize: [25, 25] }),
  van: new L.Icon({ iconUrl: vanIcon, iconSize: [25, 25] }),
};

// Custom Location Pin Icon
const locationPinIcon = new L.Icon({
  iconUrl: locationPinIconImage,
  iconSize: [40, 40],
});

// Fetch the location using OpenCage API
const fetchLocation = async (query) => {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${OpenCageApiKey}`
    );
    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      return { lat, lng };
    }
  } catch (error) {
    console.error('Error fetching location:', error);
  }
  return null;
};

// Function to generate random drivers near a point
function generateRandomDrivers(centerLat, centerLng, numDrivers, radiusKm) {
  const drivers = [];
  for (let i = 0; i < numDrivers; i++) {
    const { lat, lng } = generateRandomPoint(centerLat, centerLng, radiusKm);
    const types = ['car', 'bike', 'van'];
    const driver = {
      id: i + 1,
      name: `Driver ${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      lat,
      lng,
    };
    drivers.push(driver);
  }
  return drivers;
}

function generateRandomPoint(centerLat, centerLng, radiusKm) {
  const radiusInDegrees = radiusKm / 111; // Approximate value for degrees per km
  const u = Math.random();
  const v = Math.random();
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const deltaLat = w * Math.cos(t);
  const deltaLng = w * Math.sin(t) / Math.cos(centerLat * Math.PI / 180);
  const newLat = centerLat + deltaLat;
  const newLng = centerLng + deltaLng;
  return { lat: newLat, lng: newLng };
}

// Routing Component to show correct path
function Routing({ startCoords, endCoords }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !startCoords || !endCoords) return;

    // Create a routing control instance
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(startCoords.lat, startCoords.lng),
        L.latLng(endCoords.lat, endCoords.lng),
      ],
      lineOptions: {
        styles: [{ color: 'blue', weight: 4 }],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      createMarker: () => null,
      routeWhileDragging: false,
    }).addTo(map);

    // Fit the map to the route
    routingControl.on('routesfound', function (e) {
      map.fitBounds(routingControl.getPlan().getWaypoints().map((wp) => wp.latLng));
    });

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, startCoords, endCoords]);

  return null;
}

const ORSApiKey = '5b3ce3597851110001cf6248b692cc93b6bc41b3bee7b18171044cfe';

// Main Component
function BookRide() {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [drivers, setDrivers] = useState([]); // Make drivers a state variable
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [distance, setDistance] = useState(0);
  const [fare, setFare] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [showRideHistory, setShowRideHistory] = useState(false); // State for ride history modal

  // Fake ride history data
  const rideHistory = [
    { id: 1, date: '2023-09-01', start: 'Maho', end: 'Kurunegala', fare: 900 },
    { id: 2, date: '2023-09-02', start: 'Colombo', end: 'Galle', fare: 1500 },
    { id: 3, date: '2023-09-03', start: 'Kandy', end: 'Matale', fare: 600 },
    { id: 4, date: '2023-09-04', start: 'Negombo', end: 'Chilaw', fare: 800 },
    { id: 5, date: '2023-09-05', start: 'Anuradhapura', end: 'Polonnaruwa', fare: 1200 },
    { id: 6, date: '2023-09-06', start: 'Jaffna', end: 'Mannar', fare: 1800 },
    { id: 7, date: '2023-09-07', start: 'Batticaloa', end: 'Trincomalee', fare: 1600 },
    { id: 8, date: '2023-09-08', start: 'Ratnapura', end: 'Embilipitiya', fare: 700 },
    { id: 9, date: '2023-09-09', start: 'Badulla', end: 'Ella', fare: 500 },
    { id: 10, date: '2023-09-10', start: 'Kalutara', end: 'Bentota', fare: 850 },
  ];

  const handleLocationSearch = async (location, setCoords) => {
    const coords = await fetchLocation(location);
    if (coords) {
      setCoords(coords);
    }
  };

  const fetchRoute = async (start, end) => {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORSApiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

    try {
      const response = await axios.get(url);
      const distance =
        response.data.features[0].properties.summary.distance / 1000; // Convert meters to kilometers
      const duration =
        response.data.features[0].properties.summary.duration / 60; // Convert seconds to minutes
      setDistance(distance.toFixed(2));
      setFare((distance * KmRate).toFixed(2));
    } catch (error) {
      console.error('Failed to fetch route:', error);
      alert('Failed to calculate route. Please try again.');
    }
  };

  const handleConfirm = () => {
    if (selectedDriver && startCoords && endCoords) {
      setShowPayment(true);
    } else {
      alert('Please select driver and location!');
    }
  };

  const handlePayment = () => {
    alert(
      `Payment of Rs. ${fare} successful using ${
        paymentMethod === 'card'
          ? 'Card Payment'
          : paymentMethod === 'applePay'
          ? 'Apple Pay'
          : paymentMethod === 'googlePay'
          ? 'Google Pay'
          : ''
      }!`
    );
    // Reset the form or redirect as needed
    setShowPayment(false);
    setShowPaymentOptions(false);
    setPaymentMethod('');
    setPaymentDetails({});
    // Reset other states if needed
    setSelectedDriver(null);
    setStartLocation('');
    setEndLocation('');
    setStartCoords(null);
    setEndCoords(null);
    setDistance(0);
    setFare(0);
    setDrivers([]);
  };

  useEffect(() => {
    if (startCoords && endCoords) {
      fetchRoute(startCoords, endCoords);
    }
  }, [startCoords, endCoords]);

  // Generate drivers near start location
  useEffect(() => {
    if (startCoords) {
      const generatedDrivers = generateRandomDrivers(
        startCoords.lat,
        startCoords.lng,
        5, // Number of drivers
        5 // Radius in km
      );
      setDrivers(generatedDrivers);
    } else {
      setDrivers([]);
    }
  }, [startCoords]);

  return (
    <div className="book-ride">
      <div className="header">
        <button className="ride-history-btn" onClick={() => setShowRideHistory(true)}>
          <img src={rideHistoryIcon} alt="Ride History" />
          Ride History
        </button>
      </div>

      <h2>Book a Ride</h2>
      <div className="booking-form">
        <div className="location-input">
          <input
            type="text"
            placeholder="Start Location (Maho)"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            onBlur={() => handleLocationSearch(startLocation, setStartCoords)}
          />
          <input
            type="text"
            placeholder="End Location (Kurunegala)"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            onBlur={() => handleLocationSearch(endLocation, setEndCoords)}
          />
        </div>

        <div className="map-container">
          <MapContainer center={[7.9114, 80.5439]} zoom={10} style={{ height: 400 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {startCoords && (
              <Marker position={[startCoords.lat, startCoords.lng]} icon={locationPinIcon} />
            )}
            {endCoords && (
              <Marker position={[endCoords.lat, endCoords.lng]} icon={locationPinIcon} />
            )}
            {startCoords && endCoords && (
              <Routing startCoords={startCoords} endCoords={endCoords} />
            )}

            {drivers.map((driver) => (
              <Marker
                key={driver.id}
                position={[driver.lat, driver.lng]}
                icon={vehicleIcons[driver.type]}
                eventHandlers={{
                  click: () => setSelectedDriver(driver),
                }}
              />
            ))}
          </MapContainer>
        </div>

        {selectedDriver && (
          <div className="driver-info">
            <p>Selected Driver: {selectedDriver.name}</p>
            <p>Vehicle Type: {selectedDriver.type}</p>
          </div>
        )}

        <div className="fare-details">
          <p>Distance: {distance} KM</p>
          <p>Fare: Rs. {fare}</p>
        </div>

        <button className="confirm-btn" onClick={handleConfirm}>
          Confirm Ride
        </button>

        {showPayment && (
          <div className="ride-confirmation">
            <h3>Ride Confirmed!</h3>
            <p>Distance: {distance} KM</p>
            <p>Fare: Rs. {fare}</p>
            <button className="payment-btn" onClick={() => setShowPaymentOptions(true)}>
              Proceed to Payment
            </button>
          </div>
        )}

        {showPaymentOptions && (
          <div className="payment-options">
            <div className="payment-modal">
              <button className="close-btn" onClick={() => setShowPaymentOptions(false)}>
                &times;
              </button>
              <h3>Select Payment Method</h3>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select Payment Method</option>
                <option value="card">Card Payment</option>
                <option value="applePay">Apple Pay</option>
                <option value="googlePay">Google Pay</option>
              </select>

              {paymentMethod === 'card' && (
                <div className="card-payment-form">
                  <input
                    type="text"
                    placeholder="Card Number"
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, expiry: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, cvv: e.target.value })
                    }
                  />
                  <button className="pay-btn" onClick={handlePayment}>
                    Pay Rs. {fare}
                  </button>
                </div>
              )}

              {paymentMethod === 'applePay' && (
                <div className="apple-pay-form">
                  <p>Proceeding with Apple Pay...</p>
                  <button className="pay-btn" onClick={handlePayment}>
                    Pay Rs. {fare} with Apple Pay
                  </button>
                </div>
              )}

              {paymentMethod === 'googlePay' && (
                <div className="google-pay-form">
                  <p>Proceeding with Google Pay...</p>
                  <button className="pay-btn" onClick={handlePayment}>
                    Pay Rs. {fare} with Google Pay
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {showRideHistory && (
          <div className="ride-history-modal">
            <div className="ride-history-content">
              <button className="close-btn" onClick={() => setShowRideHistory(false)}>
                &times;
              </button>
              <h3>Ride History</h3>
              <ul>
                {rideHistory.map((ride) => (
                  <li key={ride.id}>
                    <p>Date: {ride.date}</p>
                    <p>From: {ride.start}</p>
                    <p>To: {ride.end}</p>
                    <p>Fare: Rs. {ride.fare}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookRide;
