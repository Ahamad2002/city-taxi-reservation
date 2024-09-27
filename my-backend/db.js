const mysql = require('mysql');

// Configuration for database connection
const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'citytaxi',

  
};

// Create a MySQL connection
const connection = mysql.createConnection(config);

// Connect to the database
connection.connect(error => {
  if (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Terminate the process with an error code
  }
  console.log("Successfully connected to the database.");
});

module.exports = connection;
