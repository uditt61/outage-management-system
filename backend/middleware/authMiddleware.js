const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get the token from the "Authorization: Bearer <token>" header
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.user = decoded; // Add the decoded payload (like user ID and role) to the request object
    next(); // Proceed to the actual route controller
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};