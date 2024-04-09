// connection to databases
const mongoose = require('mongoose');
require('dotenv').config();

// Define the MongoDB connection URL
const mongoURL = process.env.DB_URL_LOCAL;
// const mongoURL = process.env.DB_URL;

// Set up MongoDB connections
mongoose.connect(mongoURL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
})

// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection.
const db = mongoose.connection;

// Define the event listners for database connection
db.on('connected', () => {
  console.log('Connected to MongoDB Server');
})
db.on('error', (err) => {
  console.log('MongoDB connection error:', err);
})
db.on('disconnected', () => {
  console.log('MongoDB disconnected');
})

// export the database connection
module.exports = db;