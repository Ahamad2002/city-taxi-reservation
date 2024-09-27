import React, { useState } from 'react';
import '../css/ViewBookings.css';

function ViewBookings() {
  const [bookings] = useState([
    { id: 1, passenger: 'Nimal Perera', pickup: 'Colombo', dropoff: 'Galle', fare: 4500 },
    { id: 2, passenger: 'Sunil Silva', pickup: 'Kandy', dropoff: 'Colombo', fare: 7000 },
    { id: 3, passenger: 'Amara Wijesekera', pickup: 'Nuwara Eliya', dropoff: 'Ella', fare: 3000 },
    { id: 4, passenger: 'Chamari Priyadharshani', pickup: 'Jaffna', dropoff: 'Vavuniya', fare: 4000 },
    { id: 5, passenger: 'Mahesh Jayawardena', pickup: 'Matara', dropoff: 'Hambantota', fare: 3200 },
    { id: 6, passenger: 'Saman Kumara', pickup: 'Anuradhapura', dropoff: 'Polonnaruwa', fare: 2800 },
    { id: 7, passenger: 'Lakmini Silva', pickup: 'Colombo', dropoff: 'Negombo', fare: 2000 }
  ]);

  return (
    <div className="view-bookings">
      <h1>View Bookings</h1>
      <p>Explore the bookings made by passengers, displayed in a visually engaging format.</p>
      <div className="bookings-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Passenger</th>
              <th>Pickup</th>
              <th>Dropoff</th>
              <th>Fare (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.passenger}</td>
                <td>{booking.pickup}</td>
                <td>{booking.dropoff}</td>
                <td>LKR {booking.fare.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewBookings;
