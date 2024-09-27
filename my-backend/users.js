const connection = require('./db');
const mailjet = require('node-mailjet').apiConnect('f70227288e8fb716b4c0bea7cd139503', '10861b1e282b89cc4dbcef0bce847279');

// Function to send a welcome email using Mailjet
const sendWelcomeEmail = (email, username, password, role) => {
    const request = mailjet
        .post("send", { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: "mohomadrinas2002@gmail.com", // Verified sender email in Mailjet
                        Name: "City Taxi"
                    },
                    To: [
                        {
                            Email: email,
                            Name: username
                        }
                    ],
                    Subject: "Welcome to City Taxi!",
                    TextPart: `Dear ${username}, welcome to City Taxi! Your username is ${username}, your password is ${password}, and your role is ${role}. Please keep your credentials safe.`,
                    HTMLPart: `<h3>Dear ${username}, welcome to City Taxi!</h3>
                               <br>Your username is: <b>${username}</b>
                               <br>Your password is: <b>${password}</b>
                               <br>Your role is: <b>${role}</b>
                               <br>Please keep your credentials safe.`
                }
            ]
        });

    request
        .then((result) => {
            console.log("Email sent successfully:", result.body);
        })
        .catch((err) => {
            console.error("Error sending email:", err.statusCode, err.response.body);
        });
};

// Function to add a new user to the database
const addUser = (userData, callback) => {
    const sql = 'INSERT INTO users SET ?';
    connection.query(sql, userData, (error, results) => {
        if (error) {
            console.error('Error inserting user:', error);
            return callback(error, null);
        }

        // After inserting the user, send a welcome email including username, password, and role
        sendWelcomeEmail(userData.email, userData.username, userData.password, userData.role);

        // Return the result
        callback(null, { id: results.insertId, ...userData });
    });
};

module.exports = { addUser };
