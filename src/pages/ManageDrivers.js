import React, { useState } from 'react';
import '../css/ManageDrivers.css'; // Ensure the CSS path is correct

function ManageDrivers() {
  const [bookings, setBookings] = useState([
    { id: 1, passenger: 'Nimal Perera', location: 'Colombo', destination: 'Galle', driver: '', driverInfo: {} },
    { id: 2, passenger: 'Sunil Silva', location: 'Kandy', destination: 'Colombo', driver: '', driverInfo: {} }
  ]);
  const [drivers] = useState([
    { id: 101, name: 'Kamal Perera', location: 'Colombo', mobile: '0771234567' },
    { id: 102, name: 'Saman Kumara', location: 'Galle', mobile: '0777654321' }
  ]);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Function to assign a driver to a booking
  const assignDriver = (bookingId, driver) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId ? { ...booking, driver: driver.id, driverInfo: driver } : booking
    );
    setBookings(updatedBookings);
    setActiveBookingId(null); // Close the driver selection modal/dropdown
  };

  // Function to show driver selection
  const showDrivers = (bookingId) => {
    setActiveBookingId(bookingId);
  };

  // Function to confirm driver assignment and remove the booking
  const confirmAssignment = (bookingId) => {
    setConfirmationMessage(`Driver assignment confirmed for booking ID ${bookingId}`);
    
    // Remove the confirmed booking
    const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
    setBookings(updatedBookings);

    // Clear confirmation message after 5 seconds
    setTimeout(() => setConfirmationMessage(''), 5000);
  };

  return (
    <div className="manage-drivers">
      <h1>Manage Drivers</h1>
      

      {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}

      <div className="bookings-list">
        {bookings.map(booking => (
          <div key={booking.id} className="booking">
            <p><strong>Passenger:</strong> {booking.passenger}</p>
            <p><strong>Location:</strong> {booking.location}</p>
            <p><strong>Destination:</strong> {booking.destination}</p>
            {booking.driverInfo.name ? (
              <>
                <p><strong>Driver:</strong> {booking.driverInfo.name} ({booking.driverInfo.mobile})</p>
                <button className="confirm-btn" onClick={() => confirmAssignment(booking.id)}>Confirm Assignment</button>
              </>
            ) : (
              <button onClick={() => showDrivers(booking.id)}>Assign Driver</button>
            )}
            {activeBookingId === booking.id && (
              <div className="driver-list">
                {drivers.map(driver => (
                  <div key={driver.id} className="driver">
                    <p>{driver.name} - {driver.mobile}</p>
                    <button onClick={() => assignDriver(booking.id, driver)}>Select</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageDrivers;
