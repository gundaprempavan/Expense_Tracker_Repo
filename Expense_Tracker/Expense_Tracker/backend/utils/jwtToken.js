// const jwt = require('jsonwebtoken');

// // Secret key for JWT (should be stored in environment variables for security)
// const JWT_SECRET = process.env.JWT_SECRET || 'yourSecretKey';

// // Generate JWT Token
// const generateToken = (username) => {
//   // Payload contains the username
//   const payload = {
//     username,
//   };

//   // Sign the token with a secret key and set expiration time (e.g., 1 hour)
//   return jwt.sign(payload, JWT_SECRET, {
//     expiresIn: '1h', // Token expires in 1 hour
//   });
// };

// // Verify JWT Token
// const verifyToken = (token) => {
//   try {
//     // Verify the token using the secret key
//     return jwt.verify(token, JWT_SECRET);
//   } catch (error) {
//     // If the token is invalid or expired, return null
//     return null;
//   }
// };

// module.exports = {
//   generateToken,
//   verifyToken,
// };


// utils/jwtToken.js
const jwt = require('jsonwebtoken');

const generateToken = (username) => {
  return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
