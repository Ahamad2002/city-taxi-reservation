// booking.js 
const connection = require('./db'); // Import the database connection

const addBooking = (bookingData, callback) => {
  const sql = 'INSERT INTO bookings SET ?';
  connection.query(sql, bookingData, (error, results) => {
    if (error) {
      console.error('Error inserting booking:', error);
      return callback(error, null);
    }
    callback(null, { id: results.insertId, ...bookingData });
  });
};

module.exports = { addBooking };