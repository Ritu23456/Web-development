const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
  // first check response header has authorization or not
  const authorization = req.headers.authorization
  if(!authorization) return res.status(401).json({error: 'Token not found'});



  // Extract the jwt toke from the request headers
  const token = req.headers.authorization.split(' ')[1];  // Bearer 2lwkejo23i52h3523  // extract the second token except Bearer

  if(!token) return res.status(401).json({error: 'Unauthorizer'});

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.user = decoded
    next();
  } catch (error) {
    console.error(error)
    res.status(401).json({error: 'Invalid token'});
  }
}

// funciton to generate JWT token
const generateToken = (userData) => {
  // Generate a new JWT token using user data
  return jwt.sign(userData, process.env.JWT_SECRET);
}


module.exports = {jwtAuthMiddleware, generateToken}