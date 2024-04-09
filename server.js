const express = require('express');
const db = require('./db');
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());  // req.body

// const passport = require('./auth');
// // final how to use passport
// app.use(passport.initialize())
// const localAuthMiddleware = passport.authenticate('local', {session: false});


// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);




const PORT = process.env.PORT || 8000 // Use 8000 as a default if PORT is not defined

app.listen(8000, () => {
  console.log(`Server started at PORT : ${PORT}`);
})